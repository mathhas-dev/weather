from access.models import Enablement


class EnablementService:
    def get_user_enablement(self, user):
        return Enablement.objects.filter(user=user).first()

    def user_enablement_exists(self, user):
        return Enablement.objects.filter(user=user).exists()
