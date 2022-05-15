from access.business import FunctionalityService
from rest_framework import permissions


class ResourcePermission(permissions.BasePermission):
    """
    Classe de permissão que verifica no banco de dados se o usuário tem acesso
    à functionality do recurso.
    O nome do recurso deve ser definido na classe Meta, atributo resource.
    Ele deve ser uma string.
    A partir do nome do recurso e o nome da action, esses valores são
    concatenados na forma resource_action. Através do resultado, é conferido
    no banco de dados se o usuário logado tem acesso a functionality de
    name_alias igual a concatenação.
    Caso queira ignorar a checagem para alguma action do resource, adicione o
    nome da action no campo ignore_actions na classe Meta.
    """

    def __get_functionality_alias(self, view):
        preffix = getattr(self.Meta, 'resource', None)
        if preffix:
            return "%s_%s" % (preffix, view.action)
        else:
            return view.action

    def __is_ignorable_action(self, view):
        _ignore = getattr(self.Meta, 'ignore_actions', [])
        _ignore.append('retrieve_permissions')
        return view.action in _ignore

    def has_permission(self, request, view):
        if self.__is_ignorable_action(view):
            return True
        name_alias = self.__get_functionality_alias(view)
        service = FunctionalityService()
        return service.has_access(request.user, name_alias)
