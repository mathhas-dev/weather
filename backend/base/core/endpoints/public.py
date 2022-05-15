from core import serializers
from core.services import ProfileCore
from django.db import transaction
from rest_framework.decorators import action
from rest_framework.response import Response

from .resource import ResourcePublicCore


class PublicResource(ResourcePublicCore):
    serializer_class = serializers.ProfileSerializer
    profile = ProfileCore()

    def get_queryset(self, **kwargs):
        raise NotImplementedError

    @action(detail=False, methods=['put'])
    @transaction.atomic
    def reset_password(self, request):
        self.profile(request=request)
        self.profile.reset_password(request)
        return Response({'detail': 'sucesso'})

    @action(detail=False, methods=['put'])
    @transaction.atomic
    def new_password(self, request):
        self.profile(request=request)
        self.profile.new_password(request)
        return Response({'detail': 'Senha redefinida com sucesso'})
