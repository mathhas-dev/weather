from access.models import Enablement, Profile
from django.core.management.base import BaseCommand
from core.models import User
from django.db import transaction


class Command(BaseCommand):
    help = 'Create an enablement of profile, to inputed username.'

    def add_arguments(self, parser):
        parser.add_argument(
            'user', type=str, help='username to set enablement')
        parser.add_argument(
            'profile', type=str, help='name_alias to set enablement')

    def handle(self, *args, **kwargs):
        try:
            with transaction.atomic():
                username, profile, name = self.__set_enablement(**kwargs)
            self.stdout.write(self.style.SUCCESS(
                f"The enablement was successfully created to {username}({name}) - {profile}"))
        except Exception as e:
            self.stdout.write(self.style.ERROR(
                '\nSome error has occured:%s\n' % e))

    def __set_enablement(self, **kwargs):
        username = kwargs.get('user')
        profile = kwargs.get('profile')

        user = User.objects.get(username=username)

        profile = Profile.objects.get(name_alias=profile)

        enablement = Enablement.objects.create(
            active_profile=profile,
            user=user,
            registration_user=user
        )
        enablement.profiles.add(profile)

        enablement.save()

        return username, profile.name, user.name
