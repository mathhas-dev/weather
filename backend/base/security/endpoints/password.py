from rest_framework.decorators import api_view
from rest_framework.response import Response
from access.models import Enablement, Profile
from core.managers import CustomUserManager
from core.models import UserSequence
from security.business import PasswordManager
from security.validators import ResetPasswordValidator, NewPasswordValidator
from django.db import transaction


@api_view(['PUT'])
def reset_password(request):
    validator = ResetPasswordValidator(
        data=request.data, context={'request': request}
    )
    validator.is_valid(raise_exception=True)
    manager = PasswordManager()
    manager.reset_password(request.data)
    return Response({'detail': 'success'})


@api_view(['POST'])
@transaction.atomic
def registrate_yourself(request):
    # Create user with given name and email
    service = CustomUserManager()
    sequence = UserSequence.objects.create()
    instance = service.create_superuser(
        sequence.sequence, request.data['name'], request.data['email'], 'admin123')

    # And set profile
    profile = Profile.objects.get(name_alias='user_user')

    enablement = Enablement.objects.create(
        active_profile=profile,
        user=instance,
        registration_user=instance
    )
    enablement.profiles.add(profile)
    enablement.save()

    # Start first access flow
    manager = PasswordManager()
    manager.reset_password({'email': request.data['email']})

    return Response({'detail': 'success'})


@api_view(['PUT'])
def new_password(request):
    """
    Este endpoint tem como finalidade setar nova senha e indicar que essa foi atualizada
    corretamente (via e-mail)
    """
    validator = NewPasswordValidator(
        data=request.data, context={'request': request}
    )
    validator.is_valid(raise_exception=True)
    manager = PasswordManager()
    manager.new_password(request.data)
    return Response({'detail': 'Senha redefinida com sucesso'})
