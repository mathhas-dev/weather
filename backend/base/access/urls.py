from access.endpoints import UserResource
from django.urls import path, include
from rest_framework import routers

router = routers.DefaultRouter(trailing_slash=True)

router.register('user', UserResource, 'user')

urlpatterns = [
    path('api/', include(router.urls))
]
