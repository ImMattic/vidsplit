from django.db import models


class Video(models.Model):
    session_id = models.CharField(max_length=50, unique=True)
    video_id = models.CharField(max_length=50, unique=True)
    video_title = models.CharField(max_length=100)
    video_length = models.IntegerField()
    timestamps = models.JSONField()
