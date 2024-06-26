from django.urls import path
from .views import Initialize, Generate, Download, Session, Delete

urlpatterns = [
    path("initialize", Initialize.as_view(), name="initialize"),
    path("generate", Generate.as_view(), name="generate"),
    path("download", Download.as_view(), name="download"),
    path("session", Session.as_view(), name="session"),
    path("delete", Delete.as_view(), name="delete")
]
