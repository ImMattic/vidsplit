from django.urls import path
from .views import DownloadPage

urlpatterns = [
    path("download", DownloadPage.as_view(), name="download-page"),
]
