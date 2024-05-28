from django.db import models


class Video(models.Model):
    session_id = models.CharField(max_length=50, unique=True, primary_key=True, default="")
    video_id = models.CharField(max_length=50, default="")
    video_title = models.CharField(max_length=100, default="")
    video_length = models.IntegerField(default=0)
    video_thumbnail = models.URLField(default="")
    timestamps = models.JSONField(default=dict(timestamps=[]))
