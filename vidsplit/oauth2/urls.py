from django.urls import path
from .views import Discord, Home, Discord_Login, Discord_Redirect

urlpatterns = [
    path("discord", Discord.as_view(), name="discord"),
    path("", Home.as_view(), name="home"),
    path("discord/login", Discord_Login.as_view(), name="discord_login"),
    path("discord/redirect", Discord_Redirect.as_view(), name="discord_redirect")
]
