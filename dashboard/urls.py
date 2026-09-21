from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='dashboard-home'),

    path(
        'api/cases/',
        views.cases_api,
        name='cases-api'
    ),

    path(
        'api/cases/register/',
        views.register_case_api,
        name='register-case-api'
    ),
    path(
        "api/csrf/", 
        views.csrf_token, 
        name="csrf_token"),
]

if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT
    )