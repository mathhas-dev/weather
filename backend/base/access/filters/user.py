from access.business import ManagementProfileService
from access.models import User
from django.db import models as db
from django_filters import rest_framework as filters
from rest_framework.filters import BaseFilterBackend


class UserAccessFilter(BaseFilterBackend):
    """
    Filters users that only the current user can see.
    """

    def filter_queryset(self, request, queryset, view):
        queryset = queryset.exclude(username='AnonymousUser')
        return queryset


class UserSearchFilter(filters.FilterSet):
    username = filters.CharFilter(lookup_expr='unaccent__icontains')
    name = filters.CharFilter(lookup_expr='unaccent__icontains')
    blocked = filters.BooleanFilter(field_name='blocked')
    bypass = filters.BooleanFilter(field_name='bypass')

    class Meta:
        model = User
        fields = [
            'username', 'name', 'blocked', 'bypass'
        ]
