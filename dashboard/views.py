import uuid
from datetime import datetime
from django.views.decorators.http import require_GET
from django.db import transaction
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import ensure_csrf_cookie
from .models import CaseRecord, EvidenceFile


@ensure_csrf_cookie
def csrf_token(request):
    return JsonResponse({"status": "success"})


def _serialize_case(request, case):
    """Return a JSON-safe representation used by the Case Files UI."""
    evidence = []
    for item in case.evidence.all().order_by('-uploaded_at'):
        evidence.append(
            {
                'name': item.file.name.rsplit('/', 1)[-1],
                'url': request.build_absolute_uri(item.file.url),
                'file_type': item.file_type,
                'uploaded_at': item.uploaded_at.isoformat(),
            }
        )

    return {
        'case_number': case.case_number,
        'name': case.name,
        'case_type': case.case_type,
        'priority': case.priority,
        'status': case.status,
        'district': case.district,
        'assigned_detective': case.assigned_detective,
        'date_reported': case.date_reported.isoformat(),
        'description': case.description or '',
        'created_at': case.created_at.isoformat(),
        'updated_at': case.updated_at.isoformat(),
        'evidence_count': len(evidence),
        'evidence': evidence,
    }



def index(request):
    """Render the main dashboard and hydrate Case Files from the database."""
    cases = list(
        CaseRecord.objects.prefetch_related('evidence').all()
    )

    today = datetime.now().date()
    open_statuses = [
        CaseRecord.STATUS_OPEN,
        CaseRecord.STATUS_INVESTIGATION,
    ]

    evidence_items = EvidenceFile.objects.count()
    evidence_today = EvidenceFile.objects.filter(uploaded_at__date=today).count()

    context = {
        'user_name': 'Det. R. Solano',
        'badge_number': '4821',
        'current_date': today.strftime('%b %d, %Y').upper(),
        'open_cases': CaseRecord.objects.filter(status__in=open_statuses).count(),
        'today_cases': CaseRecord.objects.filter(created_at__date=today).count(),
        'critical_cases': CaseRecord.objects.filter(priority='Critical').exclude(
            status=CaseRecord.STATUS_CLOSED
        ).count(),
        'closed_cases': CaseRecord.objects.filter(status=CaseRecord.STATUS_CLOSED).count(),
        'evidence_items': evidence_items,
        'evidence_today': evidence_today,
        'cases_data': [_serialize_case(request, case) for case in cases],
    }

    return render(request, 'dashboard.html', context)

@require_GET
def cases_api(request):
    """
    Return all cases for the React Case Files interface.
    """
    cases = (
        CaseRecord.objects
        .prefetch_related('evidence')
        .all()
    )

    return JsonResponse({
        'status': 'success',
        'cases': [
            _serialize_case(request, case)
            for case in cases
        ]
    })


@require_POST
@transaction.atomic
def register_case_api(request):
    """Create a case and attach all submitted evidence in one transaction."""
    try:
        name = request.POST.get('name', '').strip()
        case_type = request.POST.get('case_type', '').strip()
        district = request.POST.get('district', '').strip()
        priority = request.POST.get('priority', 'Medium').strip() or 'Medium'
        date_reported = request.POST.get('date_reported', '').strip()
        assigned_detective = request.POST.get('assigned_detective', '').strip()
        description = request.POST.get('description', '').strip()

        if not name or not case_type or not district or not date_reported:
            return JsonResponse(
                {
                    'status': 'error',
                    'message': 'Missing required mandatory fields.',
                },
                status=400,
            )

        try:
            parsed_date = datetime.strptime(date_reported, '%Y-%m-%d').date()
        except ValueError:
            return JsonResponse(
                {
                    'status': 'error',
                    'message': 'Reported date must be in YYYY-MM-DD format.',
                },
                status=400,
            )

        unique_suffix = uuid.uuid4().hex[:6].upper()
        case_number = f'CASE-{unique_suffix}'

        case_obj = CaseRecord.objects.create(
            case_number=case_number,
            name=name,
            case_type=case_type,
            priority=priority,
            status=CaseRecord.STATUS_OPEN,
            district=district,
            assigned_detective=assigned_detective,
            date_reported=parsed_date,
            description=description,
        )

        for photo in request.FILES.getlist('photos'):
            EvidenceFile.objects.create(
                case=case_obj,
                file=photo,
                file_type=EvidenceFile.PHOTO,
            )

        for video in request.FILES.getlist('videos'):
            EvidenceFile.objects.create(
                case=case_obj,
                file=video,
                file_type=EvidenceFile.VIDEO,
            )

        case_obj.refresh_from_db()
        case_data = _serialize_case(request, case_obj)

        return JsonResponse(
            {
                'status': 'success',
                'case_id': case_obj.case_number,
                'case': case_data,
            },
            status=201,
        )

    except Exception as exc:
        return JsonResponse(
            {
                'status': 'error',
                'message': f'Internal server error occurred: {exc}',
            },
            status=500,
        )
