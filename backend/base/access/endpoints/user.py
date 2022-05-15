from access.serializers.user import UserDomainSerializer
from access.validators.profile import ProfileValidator
from access import serializers
from access.business import (UserService,
                             ManagementProfileService, CpfSearch)
from access.filters import UserSearchFilter, UserAccessFilter
from access.permissions import UnlockUserPermission
from access.permissions import ResourcePermission
from access.serializers import (
    UserDetailSerializer, UserListSerializer,
    UserDetailDesblockSerializer, UserProfileSerializer,
    ConsultaCpfSerializer, ProfileSerializer)
from access.validators import UserValidator, ConsultarCpfValidator
from core.resource import ResourceCore, ModelCrud
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from rest_framework.exceptions import APIException
from rest_framework.response import Response
from rest_framework import status


class UserResourcePermission(ResourcePermission):
    class Meta:
        resource = "user"
        ignore_actions = ["profile", "profiles", "updatePreferredLanguage"]


class UserResource(ResourceCore, ModelCrud):
    business_class = UserService
    validator_class = UserValidator
    filterset_class = UserSearchFilter
    # Sempre que sobrescrever filter_backends, incluir o DjangoFilterBackend,
    # pois é ele que faz o filterset_class e o filterset_fields funcionar
    filter_backends = [DjangoFilterBackend, UserAccessFilter]
    permission_classes = [
        UserResourcePermission,
        UnlockUserPermission,
    ]

    def get_serializer_class(self):
        if self.action == 'list':
            return UserListSerializer
        elif self.action == 'retrieve_unlock':
            return UserDetailDesblockSerializer
        elif self.action == 'check_cpf':
            return ConsultaCpfSerializer
        return UserDetailSerializer

    @action(detail=False, methods=['get'], url_path='cpf/(?P<cpf>\d+)')
    def check_cpf(self, request, cpf=None):
        validator = ConsultarCpfValidator(data={'cpf': cpf})
        validator.is_valid(raise_exception=True)
        try:
            search = CpfSearch(cpf)
            serializer = self.get_serializer(search)
            return Response(serializer.data)
        except Exception as e:
            raise APIException(e)

    @action(detail=False, methods=['get'])
    def profile(self, request):
        service = self.get_business()
        instance = service.profile(request.user)
        serializer = UserProfileSerializer(instance, many=False)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def block(self, request, pk=None):
        instance = self.get_object()
        service = self.get_business()
        service.block(instance)
        return Response({'detail': 'sucesso'})

    @action(detail=True, methods=['post'])
    def unlock(self, request, pk=None):
        instance = self.get_object()
        service = self.get_business()
        service.unlock(instance)
        return Response({'detail': 'sucesso'})

    @action(detail=False, methods=['get'])
    def profiles(self, request):
        service = ManagementProfileService()
        profiles = service.list_group_profiles_user_pode_atribuir(
            request.user
        )
        serializer = ProfileSerializer(profiles, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['put'], url_path='change_active_profile')
    def change_active_profile(self, request):
        service = UserService()
        validator = ProfileValidator().validate(request.user, request.data)
        if validator:
            service.update_active_profile(request.user, request.data)
            instance = service.profile(request.user)
        serializer = UserProfileSerializer(instance, many=False)
        return Response(serializer.data)

    @action(detail=False, methods=['put'], url_path='preferred_language')
    def updatePreferredLanguage(self, request):
        service = UserService()
        service.set_preferred_language(request.data, request.user)
        return Response(status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['put'], url_path='get_user_by_email')
    def get_user_by_email(self, request):
        try:
            service = UserService()
            user = service.get_managed_user_by_email(request.user, request.data['email'])
            if user:
                serializer = UserDomainSerializer(user)
                return Response(serializer.data)
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            raise APIException(e)
