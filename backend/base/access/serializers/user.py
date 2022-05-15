from access.business.profile import ProfileService
from access.business import UserService
from core.models import MessageLogger, User
from rest_framework import serializers


class UserListSerializer(serializers.ModelSerializer):
    blocked = serializers.BooleanField(read_only=True)
    # reasons_block = serializers.SerializerMethodField()
    profile = serializers.CharField(source='profile_nome')

    class Meta:
        model = User
        fields = [
            "id", "username", "name", "blocked", "bypass",
            "profile"  # "reasons_block",
        ]

    def get_reasons_block(self, obj):
        s = UserService()
        s.check_block(obj)
        return obj.reasons_block


class UserDetailSerializer(serializers.ModelSerializer):
    profile = serializers.IntegerField(source='profile_id')
    profiles = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id", "name", "email", "username", "phone",
            "profile", "profiles", "country_code_number"
        ]

    def get_profiles(self, obj):
        profiles = ProfileService().get_user_all_profiles(obj)
        json = []
        for profile in profiles:
            json.append(profile.id)
        return json


class UserDetailDesblockSerializer(serializers.ModelSerializer):
    blocked = serializers.BooleanField(read_only=True)
    reasons_block = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id", "username", "name", "blocked", "reasons_block",
            "bypass", "json_dados_siape"
        ]

    def get_reasons_block(self, obj):
        s = UserService()
        s.check_block(obj)
        return obj.reasons_block


class UserProfileSerializer(serializers.ModelSerializer):
    profile = serializers.CharField(source='profile_nome')
    nome = serializers.CharField(source='name')
    profiles = serializers.SerializerMethodField()
    profile_id = serializers.IntegerField()
    uuid = serializers.SerializerMethodField()
    preferred_language = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "nome", "profile", "profiles", "profile_id", "uuid",
            "preferred_language"
        ]

    def get_profiles(self, obj):
        profiles = ProfileService().get_user_all_profiles(obj)
        json = []
        for profile in profiles:
            json.append(
                {
                    'name': profile.name,
                    'id': profile.id
                }
            )
        return json

    def get_uuid(self, obj):
        return obj.uuid

    def get_preferred_language(self, obj):
        return obj.get_preferred_language_display()


class ConsultaCpfSerializer(serializers.Serializer):
    cpf = serializers.CharField(read_only=True)
    nome = serializers.CharField(read_only=True)
    email = serializers.CharField(read_only=True)


class UserDomainSerializer(serializers.ModelSerializer):
    name = serializers.CharField()

    class Meta:
        model = User
        fields = ["id", "name"]


