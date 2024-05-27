from django.shortcuts import redirect
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from rest_framework import generics
import requests
from dotenv import load_dotenv
import os
from django.contrib.auth import authenticate, login
from django.views.decorators.http import require_GET

auth_url_discord = "https://discord.com/oauth2/authorize?client_id=1243943397082009774&response_type=code&redirect_uri=http%3A%2F%2F127.0.0.1%3A8000%2Foauth2%2Fdiscord%2Fredirect&scope=guilds+identify"

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
    user = response.json()
    user["has_access"] = check_user(access_token)
    return user


def check_user(access_token: str):
    allowed_guilds = os.getenv("AllowedGuilds").split(",")
    response = requests.get("https://discord.com/api/v10/users/@me/guilds", headers={
        'Authorization': 'Bearer %s' % access_token})
    guilds = response.json()
    for guild in guilds:
        if guild["id"] in allowed_guilds:
            return True
    return False


@login_required(login_url="/login")
@require_GET
def discord_getuser(request):
    user = request.user
    response = JsonResponse({
        'has_access': user.has_access,
    })
    return response


class Discord_Login(generics.ListAPIView):
    http_method_names = ["get"]

    def get(self, request, *args, **kwargs):
        response = redirect(auth_url_discord)
        return response


class Discord_Redirect(generics.ListAPIView):
    http_method_names = ["get"]

    def get(self, request, *args, **kwargs):
        if request.GET.get("error"):
            return redirect("http://127.0.0.1:8000/login")
        else:
            code = request.GET.get("code")
            user = exchange_code(code)
            discord_user = authenticate(request, user=user)
            login(request, discord_user)
            response = redirect("http://127.0.0.1:8000")
            return response
