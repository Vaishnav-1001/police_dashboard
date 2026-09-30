import uuid
from datetime import datetime
from django.views.decorators.http import require_GET, require_POST
from django.db import transaction
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import ensure_csrf_cookie
from .models import CaseRecord, EvidenceFile
from django.contrib.auth import authenticate, login, logout
from functools import wraps




def api_login_required(view_func):
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return JsonResponse(
                {
                    'status': 'error',
                    'message': 'Authentication required.',
                },
                status=401,
            )

        return view_func(request, *args, **kwargs)

    return wrapper
#login /  logout
@require_POST
def login_api(request):
    username = request.POST.get('username', '').strip()
    password = request.POST.get('password', '')

    if not username or not password:
        return JsonResponse(
            {
                'status': 'error',
                'message': 'Username and password are required.',
            },
            status=400,
        )

    user = authenticate(
        request,
        username=username,
        password=password,
    )

    if user is None:
        return JsonResponse(
            {
                'status': 'error',
                'message': 'Invalid username or password.',
            },
            status=401,
        )

    if not user.is_active:
        return JsonResponse(
            {
                'status': 'error',
                'message': 'This account is inactive.',
            },
            status=403,
        )

    login(request, user)

    return JsonResponse(
        {
            'status': 'success',
            'user': {
                'username': user.username,
            },
        }
    )


@require_POST
def logout_api(request):
    logout(request)

    return JsonResponse({
        'status': 'success',
    })


@require_GET
def current_user_api(request):
    if not request.user.is_authenticated:
        return JsonResponse(
            {
                'status': 'error',
                'authenticated': False,
            },
            status=401,
        )

    return JsonResponse(
        {
            'status': 'success',
            'authenticated': True,
            'user': {
                'username': request.user.username,
            },
        }
    )



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
        'assigned_officer': case.assigned_officer,
        'date_reported': case.date_reported.isoformat(),
        'description': case.description or '',
        'created_at': case.created_at.isoformat(),
        'updated_at': case.updated_at.isoformat(),
        'evidence_count': len(evidence),
        'evidence': evidence,
    }



def index(request):
    """Render the React application shell."""
    return render(request, 'dashboard.html')

@api_login_required
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




@api_login_required
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
        assigned_officer = request.POST.get('assigned_officer', '').strip()
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
            assigned_officer=assigned_officer,
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
