from rest_framework import generics, status
from .serializers import VideoSerializer
from .models import Video
from rest_framework.response import Response


# Querying the Youtube API:
# https://www.googleapis.com/youtube/v3/videos?key=[API_KEY]&id=[VIDEO_ID]&part=snippet&part=contentDetails

class Initialize(generics.ListAPIView):
    http_method_names = ["post"]

    def post(self, request, *args, **kwargs):
        serializer = VideoSerializer(data=request.data)
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
