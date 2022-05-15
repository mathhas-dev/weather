# encoding: utf-8
from core.util import pretty_time_delta
import django.contrib.auth.password_validation as validators
from datetime import datetime
from core.services.email import Email
from dateutil.parser import parse
from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.exceptions import ObjectDoesNotExist, ValidationError
from django.db import transaction
from itsdangerous import URLSafeSerializer, BadSignature
from rest_framework.exceptions import NotFound, APIException
from core.utils.internacionalization import template_internacionalization


class ResetPasswordEmail(Email):
    subject = f"{settings.SYSTEM_NAME} - Recover password"

    def __init__(self, user, token, **kwargs):
        super().__init__(user, **kwargs)

        template = template_internacionalization('reset_password', user)

        self.template = template
        self.url = 'change_password/' + token
        seconds = settings.RECOVERY_THRESHOLD
        self.add_extra('tempo', pretty_time_delta(seconds))
        self.to_email = [user.email]
        self.enabled = True


class DonePasswordEmail(Email):
    subject = f"{settings.SYSTEM_NAME} - Password reset"

    def __init__(self, user, **kwargs):
        super().__init__(user, **kwargs)

        template = template_internacionalization('done_password', user)

        self.template = template
        self.to_email = [user.email]
        self.enabled = True


class First_access_user(Email):
    subject = f"Welcome to {settings.SYSTEM_NAME}!"

    def __init__(self, user, token, **kwargs):
        super().__init__(user, **kwargs)

        template = template_internacionalization('first_access', user, True)

        self.template = template
        self.enabled = True
        self.to_email = user.email
        self.url = 'change_password/' + token
        seconds = settings.RECOVERY_THRESHOLD
        self.add_extra('tempo', pretty_time_delta(seconds))
        self.add_extra('login', user.username)


class PasswordManager:
    @transaction.atomic
    def reset_password(self, data):
        try:
            User = get_user_model()
            user = User.objects.get(email__iexact=data.get('email'))
            dangerous = URLSafeSerializer(settings.SECRET_KEY)
            today = datetime.now()
            data = {
                'user_id': user.id,
                'create': today.isoformat()
            }
            token = dangerous.dumps(data)
            if user.last_login:
                email = ResetPasswordEmail(user, token)
            else:
                email = First_access_user(user, token)
            email.send()
            return user
        except ObjectDoesNotExist:
            raise NotFound({'email': ['User not found. Review the email.']})

    @transaction.atomic
    def new_password(self, data):
        try:
            User = get_user_model()
            dangerous = URLSafeSerializer(settings.SECRET_KEY)
            try:
                token = dangerous.loads(data['token'])
            except BadSignature:
                raise APIException(
                    "Solicite outro e-mail de recuperação de senha."
                )
            today = datetime.now()
            create = parse(token['create'])
            threshold = today - create
            if threshold.seconds < settings.RECOVERY_THRESHOLD:
                try:
                    validators.validate_password(data['new'], user=User)
                    user = User.objects.get(id=token['user_id'])
                    user.set_password(data['new'])
                    user.save()
                    email = DonePasswordEmail(user)
                    email.send()
                except ValidationError as err:
                    raise APIException(err.messages)
            else:
                raise APIException(
                    'Solicite outro e-mail de recuperação de senha.'
                )
        except ObjectDoesNotExist:
            raise NotFound(
                'User not found. Review the email.'
            )
