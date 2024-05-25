from django.urls import path
from .views import Discord, Home

urlpatterns = [
    path("discord", Discord.as_view(), name="discord"),
    path("", Home.as_view(), name="home")
]
