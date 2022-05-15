from access.models import Profile
from rest_framework import serializers
from access.business.profile import ProfileService


class ProfileValidator():
    def __not_valid_profile(self, instance, data):
        """
        Checks if main profile is in the profiles.
        """
        profiles = ProfileService().get_user_all_profiles(instance)
        profile = Profile.objects.filter(id=data['profile_id']).first()

        if profile not in profiles:
            return True
        return False

    def validate(self, instance, data):
        if self.__not_valid_profile(instance, data):
            raise serializers.ValidationError(
                {"profile": "Active Profile must be in Profiles!"}
            )
        return True
