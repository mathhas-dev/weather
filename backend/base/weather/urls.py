from weather.endpoints import WeatherResource
from django.urls import path, include
from rest_framework import routers

router = routers.DefaultRouter(trailing_slash=True)

router.register('weather', WeatherResource, 'weather')

urlpatterns = [
    path('api/', include(router.urls))
]
