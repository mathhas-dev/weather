import os
import codecs
from django.conf import settings
from django.utils.timezone import activate
from django.utils import timezone
from core.models import MessageTemplate, UserSequence
from django.contrib.auth.models import Group
from django.core.management import BaseCommand
from django.db import transaction
from access.models import Functionality, ManagementProfile, Profile, ProfileFunctionality
from core.managers import CustomUserManager


class Command(BaseCommand):
    NOW = timezone.now()
    help = 'Remove all data from database. Then, populates the database with the minimum data to use the system.'

    def add_arguments(self, parser):
        pass

    def handle(self, *args, **options):
        activate(settings.TIME_ZONE)
        with transaction.atomic():
            try:
                # Remove all data
                os.system("python manage.py flush")

                # Remove selected data
                self.__clear_profile_functionalities()
                self.__clear_management_profiles()
                self.__clear_profiles()
                self.__clear_functionalities()

                # Create users
                service = CustomUserManager()

                sequence = UserSequence.objects.create(sequence=10000)
                user = service.create_superuser(
                    sequence.sequence, 'Matheus Henrique', 'mathkeka@gmail.com', 'admin123')

                sequence = UserSequence.objects.create(sequence=10001)
                user_voltalia = service.create_user(
                    sequence.sequence, 'Usuario Voltalia 1', 'voltalia@voltalia.com', 'admin123')

                sequence = UserSequence.objects.create(sequence=10002)
                user_voltalia_2 = service.create_user(
                    sequence.sequence, 'Usuario Voltalia 2', 'voltalia2@voltalia.com', 'admin123')

                # Create all data

                self.stdout.write(self.style.SUCCESS(
                    '\nStarting data creation...\n'))

                self.__create_profiles()

                self.stdout.write(self.style.SUCCESS(
                    '\n1/6...\n'))

                self.__create_functionalities()

                self.stdout.write(self.style.SUCCESS(
                    '\n2/6...\n'))

                self.__create_profile_functionalities()

                self.stdout.write(self.style.SUCCESS(
                    '\n3/6...\n'))

                self.__create_management_profiles()

                self.stdout.write(self.style.SUCCESS(
                    '\n4/6...\n'))

                self.__create_templates_email()

                self.stdout.write(self.style.SUCCESS(
                    '\n5/6...\n'))

                self.stdout.write(self.style.SUCCESS(
                    '\n6/6...\n'))

                self.stdout.write(self.style.SUCCESS(
                    '\nAll data were successfully created!\n'))
            except Exception as e:
                self.stdout.write(self.style.ERROR(
                    '\nSome error has occured:\n%s\n' % e))

        # Set Enablement to created users
        os.system(
            f"python manage.py set_enablement {user.username} user_admin")
        os.system(
            f"python manage.py set_enablement {user_voltalia.username} user_user")
        os.system(
            f"python manage.py set_enablement {user_voltalia_2.username} user_user")

# ____________________Métodos_auxiliares_______________________

    def __clear_profiles(self):
        Profile.objects.all().delete()

    def __clear_functionalities(self):
        Functionality.objects.all().delete()

    def __clear_profile_functionalities(self):
        ProfileFunctionality.objects.all().delete()

    def __clear_management_profiles(self):
        ManagementProfile.objects.all().delete()

    profiles = [
        {
            "name": "Admin",
            "name_alias": "user_admin"
        },
        {
            "name": "User",
            "name_alias": "user_user"
        },
    ]

    def __create_profiles(self):
        for profile in self.profiles:
            Profile.objects.create(**profile)
            Group.objects.create(name=profile['name_alias'])

    functionalities = [
        # User
        {
            "name": "Register user",
            "name_alias": "user_create"
        },
        {
            "name": "update user",
            "name_alias": "user_update"
        },
        {
            "name": "Remove user",
            "name_alias": "user_destroy"
        },
        {
            "name": "List user",
            "name_alias": "user_list"
        },
        {
            "name": "Get user",
            "name_alias": "user_retrieve"
        },
        {
            "name": "Consult CPF",
            "name_alias": "user_consult_cpf"
        },
        {
            "name": "Get user information to unlock",
            "name_alias": "user_retrieve_unlock"
        },
        {
            "name": "Unlock user",
            "name_alias": "user_unlock"
        },
        {
            "name": "Block user",
            "name_alias": "user_block"
        },
        {
            "name": "User change his active profile",
            "name_alias": "user_change_active_profile"
        },
        {
            "name": "Get managed users by email",
            "name_alias": "user_get_user_by_email"
        },
    ]

    def __create_functionalities(self):
        for func in self.functionalities:
            Functionality.objects.create(**func)

    profile_funcionalities = [
        {
            "profile": [
                "user_admin"
            ],
            "functionality": [
                "user_create", "user_update", "user_destroy",
                "user_list", "user_retrieve", "user_consult_cpf",
                "user_retrieve_unlock", "user_unlock", "user_block",
                "user_change_active_profile", "user_get_user_by_email"
            ]
        },
        {
            "profile": [
                "user_user"
            ],
            "functionality": [
                "user_change_active_profile",
            ]
        }
    ]

    def __create_profile_functionalities(self):
        for p in self.profile_funcionalities:
            for _p in p.get('profile'):
                __p = Profile.objects.get(name_alias=_p)
                for f in p.get('functionality'):
                    _f = Functionality.objects.get(name_alias=f)
                    ProfileFunctionality.objects.create(
                        profile=__p,
                        functionality=_f)

    # Will be used to set global permissions per profile "and above"
    management_profiles = [
        {
            "profile_manager": "user_admin",
            "profile_managed": "user_user",
        },
    ]

    def __create_management_profiles(self):
        for mp in self.management_profiles:
            data = {}
            data['profile_manager'] = Profile.objects.get(
                name_alias=mp['profile_manager'])
            data['profile_managed'] = Profile.objects.get(
                name_alias=mp['profile_managed'])
            ManagementProfile.objects.create(**data)

    def __create_templates_email(self):
        security_templates = [
            "done_password_en",
            "first_access_en",
            "reset_password_en",

            "done_password_es",
            "first_access_es",
            "reset_password_es",

            "done_password_pt_br",
            "first_access_pt_br",
            "reset_password_pt_br",
        ]

        # Templates in SECURITY app
        for name in security_templates:
            text = codecs.open(f"././././security/templates/emails/{name}.html",
                               "r", encoding="utf-8").read()
            MessageTemplate.objects.create(path=name, template=text, type=1)
