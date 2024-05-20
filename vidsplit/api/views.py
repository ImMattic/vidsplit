from django.shortcuts import render
from rest_framework import generics, status
from .serializers import VideoSerializer
from .models import Video
from rest_framework.views import APIView
from rest_framework.response import Response


class DownloadPage(generics.ListAPIView):
    def get(self, request, *args, **kwargs):
        session_id = self.
        video_id = self.kwargs.get("video_id")
        video = Video.objects.get(id=video_id)
        serializer = VideoSerializer(video)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request, *args, **kwargs):
        video_id = self.kwargs.get("video_id")
        session_id = request.session.session_key
        video = Video.objects.get(id=video_id, sesh_id = request.session.session_key)
        serializer = VideoSerializer(video, data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

