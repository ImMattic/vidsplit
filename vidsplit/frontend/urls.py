from .views import index, handle_video
from django.urls import path, re_path

urlpatterns = [path("", index), path("watch", handle_video, name='handle_video')]
