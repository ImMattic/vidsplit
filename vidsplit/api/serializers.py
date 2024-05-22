from rest_framework import serializers
from .models import Video


class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = (
            "session_id",
            "video_id",
            "video_title",
            "video_length",
            "video_thumbnail",
            "timestamps",
        )
