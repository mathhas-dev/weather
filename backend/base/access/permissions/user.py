from rest_framework import permissions


class UnlockUserPermission(permissions.BasePermission):
    """
    Checks if the logged in user has permission to
    unlock the user in question.
    """

    def has_object_permission(self, request, view, obj):
        if view.action != 'unlock':
            return True
        return self.__can_unlock(request.user, obj)

    def __can_unlock(self, user_logado, user_a_unlock):
        return user_logado != user_a_unlock

