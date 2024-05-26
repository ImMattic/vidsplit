from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from rest_framework import generics, status
from .serializers import UserSerializer
from .models import User
from rest_framework.response import Response
import requests
from dotenv import load_dotenv
import os

auth_url_discord = "https://discord.com/oauth2/authorize?client_id=1243943397082009774&response_type=code&redirect_uri=http%3A%2F%2F127.0.0.1%3A8000%2Foauth2%2Fdiscord%2Fredirect&scope=identify"

# Load environment variables
load_dotenv()


def exchange_code(code: str):
    data = {
        "client_id": os.getenv("ClientID"),
        "client_secret": os.getenv("ClientSecret"),
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": "http://127.0.0.1:8000/oauth2/discord/redirect",
        "scope": "identify",
    }
    headers = {
        "Content-Type": "application/x-www-form-urlencoded",
    }
    response = requests.post("https://discord.com/api/oauth2/token", data=data, headers=headers)
    credentials = response.json()
    access_token = credentials["access_token"]
    response = requests.get("https://discord.com/api/v10/users/@me", headers={
        'Authorization': 'Bearer %s' % access_token
    })
    return response.json()


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


class Discord_Login(generics.ListAPIView):
    http_method_names = ["get"]

    def get(self, request, *args, **kwargs):
        # auth_session = request.GET.get("auth_session")
        response = redirect(auth_url_discord)
        return response


class Discord_Redirect(generics.ListAPIView):
    http_method_names = ["get"]

    def get(self, request, *args, **kwargs):
        # auth_session = request.GET.get("auth_session")
        code = request.GET.get("code")
        user = exchange_code(code)
        return JsonResponse({"user": user["username"]})
