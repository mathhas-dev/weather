from rest_framework.decorators import api_view
from access.business import UserService
from access.business.user import UserBloqueado
from rest_framework import status
from rest_framework.exceptions import APIException, AuthenticationFailed
from rest_framework.response import Response
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.views import TokenObtainPairView


class TokenObtainPairViewBlocking(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        service = UserService()
        try:
            serializer.is_valid(raise_exception=True)
            service.on_authentication_success(serializer.user)
        except TokenError as e:
            raise InvalidToken(e.args[0])
        except AuthenticationFailed as e:
            service.on_authentication_error(**request.data)
            raise e
        except UserBloqueado as e:
            raise APIException(e)

        return Response(serializer.validated_data, status=status.HTTP_200_OK)

@api_view(['POST'])
def ValidateSmsToken(request):
    try:
        token = request.data['token']
        session_token = request.session.get('token_sms')
        request.session['2FA'] = True
        
        if session_token == token:
            return Response({'detail': True}, status=status.HTTP_200_OK)
        return Response({'detail': False}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        raise APIException(e)

