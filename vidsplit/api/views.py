from django.shortcuts import render
from rest_framework import generics, status
from .serializers import VideoSerializer
from .models import Video
from rest_framework.views import APIView
from rest_framework.response import Response


class CreateDownloadPage(generics.ListAPIView):
    queryset = Video.objects.all()
    serializer_class = VideoSerializer