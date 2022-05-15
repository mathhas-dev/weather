from core.utils.choices import COUNTRY_CODE, MESSAGE_TYPE, LANGUAGES
from django.db.models.fields import AutoField
from core.db import BaseModel
from django.contrib.auth.models import AbstractBaseUser
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import PermissionsMixin
from .managers import CustomUserManager


class User(AbstractBaseUser, BaseModel, PermissionsMixin):
    name = models.CharField('Nome', max_length=500, null=True)
    username = models.CharField(
        _('username'),
        max_length=150,
        unique=True,
        error_messages={
            'unique': _("A user with that username already exists."),
        },
    )
    email = models.EmailField(_('email address'), blank=True)
    phone = models.CharField(max_length=100, null=True, blank=True, db_index=True)
    country_code_number = models.IntegerField(
        choices=COUNTRY_CODE, null=True)
    is_staff = models.BooleanField(
        _('staff status'),
        default=False,
        help_text=_(
            'Designates whether the user can log into this admin site.'),
    )
    password = models.CharField(max_length=128, null=True)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.BooleanField(default=False)
    access_attempts_number = models.SmallIntegerField(blank=True, null=True)
    is_blocked = models.BooleanField(default=False)
    bypass = models.BooleanField(default=False)
    registration_user = models.ForeignKey(
        'User', on_delete=models.PROTECT, blank=True, null=True)
    preferred_language = models.IntegerField(
        choices=LANGUAGES, default=1)

    objects = CustomUserManager()

    EMAIL_FIELD = 'email'
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email', 'name']

    def __str__(self):
        return self.username

    def clean(self):
        super().clean()
        self.email = self.__class__.objects.normalize_email(self.email)

    def email_user(self, subject, message, from_email=None, **kwargs):
        """Send an email to this user."""
        send_mail(subject, message, from_email, [self.email], **kwargs)

    @property
    def is_staff(self):
        """check if user can log in administration page"""
        return self.is_superuser

    @property
    def get_is_active(self):
        """check if user is active"""
        # return not self.is_blocked and self.is_active
        return self.is_active

    def set_password(self, raw_password):
        super().set_password(raw_password)
        self.access_attempts_number = 0


class UserSequence(models.Model):
    """
    This model is used to set "username" in User
    """
    sequence = AutoField(primary_key=True, unique=True)


class MessageTemplate(BaseModel):
    language = models.IntegerField(
        choices=LANGUAGES, default=1)
    path = models.CharField(max_length=255, unique=True)
    template = models.TextField()
    type = models.IntegerField(choices=MESSAGE_TYPE)
    # TODO: Add "subject"


class MessageLogger(BaseModel):
    message_template = models.ForeignKey(
        'MessageTemplate', on_delete=models.PROTECT)
    sent = models.DateTimeField(null=True, blank=True)
    scheduled = models.DateTimeField(null=True, blank=True)
    subject = models.CharField(max_length=255, null=True, blank=True)
    recipient = models.CharField(
        max_length=255, null=True, blank=True)  # E-Mail or Cell
    user = models.ForeignKey('User', on_delete=models.PROTECT)
    # O campo abaixo serve para registrar qual entidade pai comunicou o usuário
    # Em várias situações ela pode ser vazia, como em recuperação de senha
    related_entity_uuid = models.UUIDField(null=True)
