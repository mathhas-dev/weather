from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend

UserModel = get_user_model()


class CaseInsensitiveModelBackend(ModelBackend):
    """
    Authenticates against settings.AUTH_USER_MODEL.
    Ignora caixa alta/baixa do username.
    Inspirado no ModelBackend e em
    https://simpleisbetterthancomplex.com/tutorial/2017/02/06/how-to-implement-case-insensitive-username.html
    """

    def authenticate(self, request, username=None, password=None, **kwargs):
        token_sms = None
        if 'token_sms' in request.data:
            token_sms = request.data['token_sms']
            phone_number = request.session.get('phone_number')
            username = UserModel.objects.get(phone=phone_number).username
        if username is None:
            username = kwargs.get(UserModel.USERNAME_FIELD)
        try:
            case_insensitive_username_field = '{}__iexact'.format(
                UserModel.USERNAME_FIELD
            )
            user = UserModel._default_manager.get(
                **{case_insensitive_username_field: username}
            )
        except UserModel.DoesNotExist:
            # Run the default password hasher once to reduce the timing
            # difference between an existing and a nonexistent user (#20760).
            UserModel().set_password(password)
        else:
            # SMS Authentication
            if token_sms:
                session_token = request.session.get('token_sms')
                if session_token == token_sms:
                    request.session['2FA'] = True # Usado para validar se o 2FA foi realizado
                    return user
            
            # Username and password Authentication
            if user.check_password(password) and self.user_can_authenticate(user):
                return user

