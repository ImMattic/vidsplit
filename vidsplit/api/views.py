from rest_framework import generics, status
from .serializers import VideoSerializer
from .models import Video
from rest_framework.response import Response
import regex as re
import requests
import isodate


# Querying the Youtube API:
# https://www.googleapis.com/youtube/v3/videos?key=[API_KEY]&id=[VIDEO_ID]&part=snippet&part=contentDetails

class Initialize(generics.ListAPIView):
    http_method_names = ["post"]

    def post(self, request, *args, **kwargs):
        initial_request = request.data
        # Read in Youtube API key
        with open('./secrets/youtube_api_key.txt', 'r') as file:
            yt_api_key = file.read().strip()
        regex_yt_pattern = '^.*(?:(?:youtu\\.be\\/|v\\/|vi\\/|u\\/\\w\\/|embed\\/|shorts\\/)|(?:(?:watch)?\\?v(?:i)?=|\\&v(?:i)?=))([^#\\&\\?]*).*'
        video_id = re.match(regex_yt_pattern, initial_request.get("video_url")).group(1)
        yt_api_url = f"https://www.googleapis.com/youtube/v3/videos?key={yt_api_key}&id={video_id}&part=snippet&part=contentDetails"
        yt_api_response = requests.get(yt_api_url)
        thumbnail = yt_api_response.json()["items"][0]["snippet"]["thumbnails"]["high"]["url"]
        title = yt_api_response.json()["items"][0]["snippet"]["title"]
        length = isodate.parse_duration(yt_api_response.json()["items"][0]["contentDetails"]["duration"]).total_seconds()
        serializer = VideoSerializer(data={
            "session_id": initial_request.get("session_id"),
            "video_url": initial_request.get("video_url"),
            "video_id": initial_request.get("video_id"),
            "video_title": title,
            "video_length": length,
            "video_thumbnail": thumbnail,
        })
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class Generate(generics.ListAPIView):
    http_method_names = ["put"]

    def put(self, request, *args, **kwargs):
        video_id = self.kwargs.get("video_id")
        video = Video.objects.get(video_id=video_id, session_id=request.session.session_key)
        serializer = VideoSerializer(video, data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class Download(generics.ListAPIView):
    http_method_names = ["get"]

    def get(self, request, *args, **kwargs):
        video_id = self.kwargs.get("video_id")
        video = Video.objects.get(video_id=video_id, session_id=request.session.session_key)
        serializer = VideoSerializer(video)
        return Response(serializer.data)


class Session(generics.ListAPIView):
    http_method_names = ["get"]

    def get(self, request, *args, **kwargs):
        video = Video.objects.get(session_id=request.session.session_key)
        serializer = VideoSerializer(video)
        return Response(serializer.data)
