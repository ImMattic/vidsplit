from django.db import models
from .managers import DiscordUserOAuth2Manager


class User(models.Model):
    auth_token = models.CharField(max_length=50, unique=True, primary_key=True, default="")
    refresh_token = models.CharField(max_length=50, default="")
    username = models.CharField(max_length=50, default="")


class DiscordUser(models.Model):
    objects = DiscordUserOAuth2Manager()
    id = models.CharField(max_length=50, unique=True, primary_key=True, default="")
    username = models.CharField(max_length=50, default="")
    avatar = models.CharField(max_length=50, default="", null=True)
    public_flags = models.CharField(max_length=50, default="", null=True)
    flags = models.CharField(max_length=50, default="", null=True)
    locale = models.CharField(max_length=50, default="", null=True)
    mfa_enabled = models.CharField(max_length=50, default="", null=True)
    last_login = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    has_access = models.BooleanField(default=False)

    def is_authenticated(self, request):
        return True
