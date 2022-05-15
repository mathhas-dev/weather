from access.models import Functionality, ProfileFunctionality
from .profile import ProfileService
from django.conf import settings


class FunctionalityService:
    def get_access(self, user, resource):
        service = ProfileService()
        profile = service.get_user_profile(user)
 
        if not resource:
            raise ValueError("Parâmetro 'resource' deve ser passado.")

        profile_functionalities = []
        _profile_functionalities = ProfileFunctionality.objects.filter(
            profile=profile,
            functionality__name_alias__startswith=f'{resource}_'
        )

        can_destroy,  can_list,  can_retrieve,  can_update = False, False, False, False
 
        for pf in _profile_functionalities:
            permission = pf.functionality.name_alias.replace(f'{resource}_','')
            if not permission in profile_functionalities:
                profile_functionalities.append(permission)

        can_destroy = True if 'destroy' in profile_functionalities else False
        can_list = True if 'list' in profile_functionalities else False
        can_retrieve = True if 'retrieve' in profile_functionalities else False
        can_update = True if 'update' in profile_functionalities else False
 
        if user.is_superuser:
            can_destroy,  can_list,  can_retrieve,  can_update = True, True, True, True

        obj = {
            'functionalities':profile_functionalities,
            'can_destroy': can_destroy,
            'can_list' : can_list,
            'can_retrieve': can_retrieve,
            'can_update': can_update
        }

        return obj
        
    def has_access(self, user, functionality):
        """
        Checks if the user has access to functionality.
        """
        profileService = ProfileService()
        profile = profileService.get_user_profile(user)
        if profile[0].name_alias == settings.ADMIN_PROFILE:
            return True
        
        param = {}
        if isinstance(functionality, Functionality):
            param['functionality'] = functionality
        elif isinstance(functionality, str):
            param['functionality__name_alias'] = functionality
        elif isinstance(functionality, int):
            param['functionality_id'] = functionality
        else:
            raise ValueError("Parâmetro 'functionality' deve ser um inteiro, "
                             "string ou Functionality, não '%s'."
                             % functionality.__class__.__name__)

        qtd = ProfileFunctionality.objects.filter(
            **param,
            profile=profile
        ).count()

        return qtd > 0
