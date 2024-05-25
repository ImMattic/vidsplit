from django.shortcuts import render
from django.http import JsonResponse
from rest_framework import generics, status
from .serializers import UserSerializer
from .models import User
from rest_framework.response import Response


# Create your views here.
class Home(generics.ListAPIView):
    http_method_names = ["get"]

    def get(self, request, *args, **kwargs):
        # auth_session = request.GET.get("auth_session")
        response = JsonResponse({"message": "Hello world!"})
        return response


class Discord(generics.ListAPIView):
    http_method_names = ["get"]

    def get(self, request, *args, **kwargs):
        # auth_session = request.GET.get("auth_session")
        response = JsonResponse({"message": "Discord endpoint hit!"})
        return response