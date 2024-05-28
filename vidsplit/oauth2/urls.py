from django.urls import path
from .views import Discord_Login, Discord_Redirect, discord_getuser

urlpatterns = [
    path("discord/login", Discord_Login.as_view(), name="discord_login"),
    path("discord/redirect", Discord_Redirect.as_view(), name="discord_redirect"),
    path("discord/getuser", discord_getuser, name="discord_getuser"),
]
