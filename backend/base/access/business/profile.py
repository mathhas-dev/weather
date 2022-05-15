from access.models import Profile


class ProfileService:
    def get_user_profile(self, user, selectedProfile=None):
        qs = Profile.objects.filter(active_profile__user=user)
        if selectedProfile:
            qs = qs.filter(
                profiles=selectedProfile
            )
        return qs[:1]

    def get_user_all_profiles(self, user):
        qs = Profile.objects.filter(profiles__user=user, is_active=True)
        return qs
