from django.db import models


class Video(models.Model):
    session_id = models.CharField(max_length=50, unique=True)
    video_id = models.CharField(max_length=50, unique=True)
    timestamps = models.JSONField()
