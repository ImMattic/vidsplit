from django.urls import path
from .views import CreateDownloadPage

urlpatterns = [
    path(":video_id", CreateDownloadPage.as_view(), name="create-download-page"),
]
