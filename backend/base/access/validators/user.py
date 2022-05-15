
from access.business import ManagementProfileService
from access.models import Profile
from core.models import User
from rest_framework import serializers


class UserValidator(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    name = serializers.CharField(required=True)
    # adiciona user logado como user_cadastrado
    registration_user = serializers.HiddenField(
        default=serializers.CurrentUserDefault()
    )
    profile = serializers.PrimaryKeyRelatedField(
        many=False,
        queryset=Profile.objects.all(),
        required=True
    )
    profiles = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Profile.objects.all(),
        required=False
    )

    class Meta:
        model = User
        fields = [
            "name", "email", "registration_user",
            "profile", "profiles", "country_code_number", "phone"
        ]

    def to_internal_value(self, data):
        """
        Nome para uppercase.
        Email para lowercase.
        """
        ret = super().to_internal_value(data)
        ret['email'] = ret['email'].lower()
        ret['name'] = ret['name'].upper()
        return ret

    def __validate_user_can_set_profile(self, data):
        """
        Checks if the user can register users in the profile.
        """
        user = self.context.get('request').user
        profile = data['profile']
        service = ManagementProfileService()
        if service.user_pode_cadastrar_profile(user, profile):
            return False
        return True

    def __not_valid_profile(self, data):
        """
        Checks if main profile is in the profiles.
        """
        profiles = data['profiles']
        profile = data['profile']
        if profile not in profiles:
            return True
        return False

    def validate(self, data):

        if self.__validate_user_can_set_profile(data):
            raise serializers.ValidationError(
                "User does not have permission  to register this profile."
            )
        if self.__not_valid_profile(data):
            raise serializers.ValidationError(
                {"profile": "Main Profile must be in Profiles!"}
            )
        return data
