from django.db import models


class CaseRecord(models.Model):
    STATUS_OPEN = 'Open'
    STATUS_INVESTIGATION = 'Under Investigation'
    STATUS_CLOSED = 'Closed'

    STATUS_CHOICES = [
        (STATUS_OPEN, 'Open'),
        (STATUS_INVESTIGATION, 'Under Investigation'),
        (STATUS_CLOSED, 'Closed'),
    ]

    case_number = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=200)
    case_type = models.CharField(max_length=100)
    priority = models.CharField(max_length=50, default='Medium')
    status = models.CharField(
        max_length=30,
        choices=STATUS_CHOICES,
        default=STATUS_OPEN,
    )
    district = models.CharField(max_length=100)
    assigned_officer = models.CharField(max_length=200, blank=True, default='')
    date_reported = models.DateField()
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.case_number} - {self.name}"


class EvidenceFile(models.Model):
    PHOTO = 'photo'
    VIDEO = 'video'

    FILE_TYPE_CHOICES = [
        (PHOTO, 'Photo'),
        (VIDEO, 'Video'),
    ]

    case = models.ForeignKey(
        CaseRecord,
        on_delete=models.CASCADE,
        related_name='evidence',
    )
    file = models.FileField(upload_to='evidence_uploads/')
    file_type = models.CharField(
        max_length=20,
        choices=FILE_TYPE_CHOICES,
        default=PHOTO,
    )
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.file.name} ({self.file_type})"
