from .models import DiscordUser
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.backends import BaseBackend


# class DiscordAuthenticationBackend():
#     def authenticate(self, request, user) -> DiscordUser:
#         print("User: ", user)
#         print("Request: ", request)
#         print("DiscordUser: ", DiscordUser.objects.all())
#         print("User ID: ", user["id"])
#         try:
#             user = DiscordUser.objects.get(id=user["id"])
#             return user
#         except ObjectDoesNotExist:
#             print("User not found. Saving...")
#             print("User after saving: ", user)
#             serializer = DiscordUserSerializer(data={
#                 "id": user["id"],
#                 "username": user["username"],
#                 "avatar": user["avatar"],
#                 "public_flags": user["public_flags"],
#                 "flags": user["flags"],
#                 "locale": user["locale"],
#                 "mfa_enabled": user["mfa_enabled"],
#             })
#         if serializer.is_valid(raise_exception=True):
#             serializer.save()
#             print(serializer.data)
#             return serializer.data
    

class DiscordAuthenticationBackend(BaseBackend):
    def authenticate(self, request, user) -> DiscordUser:
        find_user = DiscordUser.objects.filter(id=user["id"])
        print("Find User: ", find_user)
        return find_user
        if len(find_user) == 0:
            print("User not found. Saving...")
            new_user = DiscordUser.objects.create_user(
                id=user["id"],
                username=user["username"],
                avatar=user["avatar"],
                public_flags=user["public_flags"],
                flags=user["flags"],
                locale=user["locale"],
                mfa_enabled=user["mfa_enabled"],
                has_access=user["has_access"],
            )
            print(new_user)
            return new_user

    def get_user(self, user_id):
        try:
            return DiscordUser.objects.get(pk=user_id)
        except DiscordUser.DoesNotExist:
            return None
