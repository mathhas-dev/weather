from django.contrib.auth.base_user import BaseUserManager
from django.apps import apps


class CustomUserManager(BaseUserManager):
    """
    Custom user model manager where email is the unique identifiers
    for authentication instead of usernames.
    """

    def _create_user(self, username, name, email, password, **extra_fields):
        """
        Create and save a user with the given username, name, email, and password.
        """
        if not username:
            raise ValueError('The given username must be set')
        if not self.model:
            self.model = apps.get_model(app_label='core', model_name='User')

        email = self.normalize_email(email)
        username = self.model.normalize_username(username)
        user = self.model(username=username, name=name,
                          email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, username, name=None, email=None, password=None, **extra_fields):
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(username, name, email, password, **extra_fields)

    def create_superuser(self, username, name, email, password, **extra_fields):
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self._create_user(username, name, email, password, **extra_fields)
