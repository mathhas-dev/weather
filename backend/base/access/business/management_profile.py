from access.models import Profile
from django.db import models as db
from django.db.models import Prefetch

from .profile import ProfileService


class ManagementProfileService:
    def __list_profiles_geridos(self, profile):
        return Profile.objects.filter(
            profile_managed__profile_manager=profile,
            profile_managed__is_active=True
        )

    def user_pode_cadastrar_profile(self, user, profile):
        return self.list_profiles_geridos_user(user).filter(
            id=profile.id
        ).count() > 0


    def list_profiles_geridos_user(self, user):
        s = ProfileService()
        profile = s.get_user_profile(user)
        return self.__list_profiles_geridos(profile)


    def list_group_profiles_user_pode_atribuir(self, user):
        return self.list_profiles_geridos_user(user)
