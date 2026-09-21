from django.contrib import admin
from .models import CaseRecord, EvidenceFile

admin.site.register(CaseRecord)
admin.site.register(EvidenceFile)