from collections import OrderedDict

from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from access.business.functionality import FunctionalityService


class CustomPagination(PageNumberPagination):
    page_size_query_param = 'page_size'

    def get_paginated_response(self, data):
        # As permissões são passadas aqui no list, para haver
        # tratamento de botões de acordo com permissões no frontend

        resource = self.request.path.split('/')[3]
        service = FunctionalityService()
        permissions = service.get_access(self.request.user, resource)

        return Response(OrderedDict([
            ('num_pages', self.page.paginator.num_pages),
            ('page', self.page.number),
            ('page_size', self.page.paginator.per_page),
            ('total_size', self.page.paginator.count),
            ('can_retrieve', permissions['can_retrieve']),
            ('can_update', permissions['can_update']),
            ('can_destroy', permissions['can_destroy']),
            ('results', data)
        ]))
