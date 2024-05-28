from django.contrib.auth import models


class DiscordUserOAuth2Manager(models.UserManager):
    def create_new_discord_user(self, user):
        print("Inside Discord User Manager")
        new_user = self.create(
            id=user["id"],
            username=user["username"],
            avatar=user["avatar"],
            public_flags=user["public_flags"],
            flags=user["flags"],
            locale=user["locale"],
            mfa_enabled=user["mfa_enabled"],
            has_access=user["has_access"]
        )
        return new_user
