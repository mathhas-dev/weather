from access.models import Modulo
from django.db.models import Prefetch

from .profile import ProfileService


class ModuloService:
    def list(self, *args, **kwargs):
        return Modulo.objects.all().filter(**kwargs).order_by('id')

    def list_user_pode_atribuir(self, user):
        # recupera apenas os profiles que o usuario pode atribuir
        profile_service = ProfileService()
        profiles = profile_service.list_user_pode_atribuir(user)

        # TODO: Filtra apenas os módulos que o usuario pode atribuir
        modulos = self.list()

        # retorna a relação indo uma vez apenas 2 vezes ao banco
        return modulos.prefetch_related(
                Prefetch('profile_set', profiles)
            )

