from .views import index
from django.urls import path

urlpatterns = [path("", index), path("<str:videoID>", index)]
