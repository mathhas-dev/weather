from rest_framework.decorators import api_view
from rest_framework.response import Response
from security.business import PasswordManager
from security.validators import ResetPasswordValidator, NewPasswordValidator


@api_view(['PUT'])
def reset_password(request):
    validator = ResetPasswordValidator(
        data=request.data, context={'request': request}
    )
    validator.is_valid(raise_exception=True)
    manager = PasswordManager()
    manager.reset_password(request.data)
    return Response({'detail': 'sucesso'})


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
