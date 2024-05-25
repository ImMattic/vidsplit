from django.db import models


class User(models.Model):
    auth_token = models.CharField(max_length=50, unique=True, primary_key=True, default="")
    refresh_token = models.CharField(max_length=50, default="")
    username = models.CharField(max_length=50, default="")
