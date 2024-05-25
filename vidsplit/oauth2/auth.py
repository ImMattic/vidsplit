from .models import DiscordUser
from .serializers import DiscordUserSerializer
from django.core.exceptions import ObjectDoesNotExist


class DiscordAuthenticationBackend():
    def authenticate(self, request, user) -> DiscordUser:
        print("User: ", user)
        print("Request: ", request)
        print("DiscordUser: ", DiscordUser.objects.all())
        print("User ID: ", user["id"])
        try:
            user = DiscordUser.objects.get(id=user["id"])
            return user
        except ObjectDoesNotExist:
            print("User not found. Saving...")
            print("User after saving: ", user)
            serializer = DiscordUserSerializer(data={
                "id": user["id"],
                "username": user["username"],
                "avatar": user["avatar"],
                "public_flags": user["public_flags"],
                "flags": user["flags"],
                "locale": user["locale"],
                "mfa_enabled": user["mfa_enabled"],
            })
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            print(serializer.data)
            return serializer.data
