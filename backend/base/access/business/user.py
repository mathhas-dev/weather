from django.contrib.auth.models import Group
from core.utils.choices import LANGUAGES
from security.business.password import PasswordManager
from access.business.enablement import EnablementService
from access.models import Enablement, ManagementProfile, Profile
from core.business import BasicService
from core.models import User, UserSequence
from django.conf import settings
from django.db import transaction, models as db
from access.business.cpf import CpfSearch
from access.business.profile import ProfileService


class UserBloqueado(Exception):
    pass


class UserService(BasicService):
    queryset = User.objects.all()

    def list(self):
        max_attempts = self.__max_attempts_login()
        qs = User.objects.annotate(
            blocked_manually=db.functions.Coalesce(
                'is_blocked', db.Value(False))
        ).annotate(
            blocked_attempts=db.Case(
                db.When(
                    access_attempts_number__gte=max_attempts,
                    then=db.Value(True)
                ),
                default=db.Value(False),
                output_field=db.BooleanField()
            )
        ).annotate(
            blocked=db.Case(
                db.When(
                    db.Q(blocked_manually=True) |
                    db.Q(blocked_attempts=True),
                    then=db.Value(True)
                ),
                default=db.Value(False),
                output_field=db.BooleanField()
            )
        )
        profile_subquery = ProfileService().get_user_profile(
            db.OuterRef('pk')
        )
        qs = qs.annotate(
            profile_id=db.Subquery(profile_subquery.values('id'))
        ).annotate(
            profile_nome=db.Subquery(profile_subquery.values('name')),
        )
        qs = qs.filter(is_active=True)
        return qs.order_by('pk')

    def profile(self, user):
        return self.single().filter(pk=user.id).get()

    def single(self):
        return self.list().filter(
            db.Q(enablement_user__isnull=True) |
            (
                db.Q(enablement_user__is_active=True)
            )
        )

    def get(self, pk=None):
        if pk is None:
            raise Exception("Unable to retrieve object.")
        return self.single().get(pk=pk)

    @transaction.atomic
    def create(self, data, user=None):
        if 'phone' in data:
            phone_in_use = User.objects.exclude(phone=None).filter(phone=data['phone']).exists()
            if phone_in_use:
                raise Exception({'phone': 'Phone alredy in use, choose another.'})

        username = UserSequence.objects.create()

        data['username'] = username.sequence

        data['bypass'] = True

        profile = data['profile']
        del data['profile']
        profiles = data['profiles']
        del data['profiles']

        instance = User.objects.create(**data)

        for p in profiles:
            group = Group.objects.get(name=p.name_alias)
            instance.groups.add(group)
        
        instance.save()

        self.__change_enablement(instance, profiles, user, profile)

        # Envia e-mail primeiro acesso
        data = {'email': instance.email}
        PasswordManager().reset_password(data)
        return self.get(instance.pk)

    @transaction.atomic
    def update(self, instance, data, user=None):
        if 'phone' in data:
            phone_in_use = User.objects.exclude(username=instance.username).exclude(
                phone=None).filter(phone=data['phone']).exists()
            if phone_in_use:
                raise Exception({'phone': 'Phone alredy in use, choose another.'})

        profile = data['profile']
        del data['profile']
        profiles = data['profiles']
        del data['profiles']

        for key, value in data.items():
            setattr(instance, key, value)

        for p in profiles:
            group = Group.objects.get(name=p.name_alias)
            instance.groups.add(group)

        all_profiles = ProfileService().get_user_all_profiles(instance)
        for p in all_profiles:
            if p not in profiles:
                group = Group.objects.get(name=p.name_alias)
                instance.groups.remove(group)
        
        instance.save()

        self.__change_enablement(instance, profiles, user, profile)
        return self.get(instance.pk)

    def update_active_profile(self, instance, data):
        profile = Profile.objects.filter(id=data['profile_id']).first()
        enablement = Enablement.objects.filter(user=instance).first()
        enablement.active_profile = profile
        enablement.save()
        return instance

    @transaction.atomic
    def remove(self, instance):
        instance.delete()
        return instance

    @transaction.atomic
    def block(self, user):
        user.is_blocked = True
        user.save()

    @transaction.atomic
    def unlock(self, user):
        max_attempts = self.__max_attempts_login()
        if user.is_blocked is True:
            user.is_blocked = False
        # if self.__exceeded_attempts_login(user):
        #     user.access_attempts_number = 0
        user.save()

    def get_profile(self, user):
        s = ProfileService()
        return s.get_user_profile(user)

    def __max_attempts_login(self):
        max_attempts = settings.MAX_ATTEMPTS_LOGIN
        params = settings.PARAMS
        if params:
            max_attempts = params.get('MAX_TENTATIVA_LOGIN', max_attempts)
        return max_attempts

    def __exceeded_attempts_login(self, user):
        return (user.access_attempts_number and
                user.access_attempts_number >= self.__max_attempts_login())

    def __change_enablement(self, user, profiles, registration_user, active_profile=None):
        try:
            service = EnablementService()
            with transaction.atomic():
                # Update
                if service.user_enablement_exists(user):
                    instance = service.get_user_enablement(user)
                    profiles_enabled = instance.profiles.all()

                    for prof in profiles:
                        instance.profiles.add(prof)
                    for prof in profiles_enabled:
                        if prof not in profiles:
                            instance.profiles.remove(prof)

                    if active_profile:
                        instance.active_profile = active_profile
                # Create
                else:
                    if active_profile:
                        instance = Enablement.objects.create(
                            active_profile=active_profile, user=user, registration_user=registration_user)

                        for prof in profiles:
                            instance.profiles.add(prof)
                    else:
                        raise Exception('You must select one main profile!')
                instance.save()
        except Exception as e:
            raise Exception(f"Error: {e}")

    def on_authentication_success(self, user):
        # Confere se user está blocked
        self.is_blocked(user, raise_exception=True)
        # Zera attempts de acesso
        user.access_attempts_number = 0
        user.save()

    def check_block(self, user):
        reasons = []
        if self.__exceeded_attempts_login(user):
            reasons.append("User has exceeded the login attempts limit.")
        if user.is_blocked:
            reasons.append("Blocked user.")
        user.blocked = True if reasons else False
        user.reasons_block = reasons
    # def check_block(self, user):
    #     return False

    def is_blocked(self, user, raise_exception=False):
        self.check_block(user)
        if user.blocked:
            if raise_exception:
                raise UserBloqueado(user.reasons_block[0])
            return True
        # return False

    def on_authentication_error(self, username=None, **kwargs):
        users = User.objects.filter(username=username)
        # Se encontrou apenas um usuario com o username, incrementa uma
        # attempt de acesso
        if users.count() == 1:
            user = users.get()
            if user.access_attempts_number is None:
                user.access_attempts_number = 0
            user.access_attempts_number += 1
            user.save()

    def set_preferred_language(self, data, user):
        languages = dict(LANGUAGES)
        index = self.__get_value_key(languages, data['language'])

        if index:
            user.preferred_language = index
            user.save()
            return user
        raise Exception("No language detected!")

    def __get_value_key(self, dictionary, language):
        for key, value in dictionary.items():
            if value == language:
                return key
        return None

    def get_managed_user_by_email(self, logged_user, searched_email):
        try:
            user = User.objects.get(email=searched_email)
            logged_user_profile = ProfileService().get_user_profile(logged_user)
            user_profile = ProfileService().get_user_profile(user)

            able_to_manage_user = ManagementProfile.objects.filter(
                profile_manager=logged_user_profile, profile_managed=user_profile).exists()
            if able_to_manage_user:
                return user
            return False
        except:
            return False
