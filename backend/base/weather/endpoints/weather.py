from weather.serializers.favoriteForecast import FavoriteForecastSerializer
from core.utils.user import UserUtils
from weather.serializers import WeatherSerializer
from weather.business import WeatherService
from access.permissions import ResourcePermission
from weather.validators import WeatherValidator
from core.resource import ResourceCore, ModelCrud
from rest_framework.decorators import action
from rest_framework.exceptions import APIException
from rest_framework.response import Response
from rest_framework import status


class WeatherResourcePermission(ResourcePermission):
    class Meta:
        resource = "weather"
        ignore_actions = ["list", "update"]


class WeatherResource(ResourceCore, ModelCrud):
    business_class = WeatherService
    validator_class = WeatherValidator
    permission_classes = [WeatherResourcePermission]
    serializer_class = WeatherSerializer

    @action(detail=False, methods=['GET'], url_path='get_favorite_day_weather')
    def get_favorite_day_weather(self, request):
        try:
            service = WeatherService()
            day_weather = service.get_managed_favorite_day_weather(
                request.user, request.data['email'])
            if day_weather:
                serializer = WeatherSerializer(day_weather)
                return Response(serializer.data)
            return Response({"detail": "Weather not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            raise APIException(e)

    @action(detail=False, methods=['GET'], url_path='get_weather_from_api_WOEID')
    def get_weather_from_api_WOEID(self, request):
        try:
            woeid = request.data['woeid']
            service = WeatherService()
            results = service.get_weather_from_api_WOEID(woeid)
            serializer = WeatherSerializer(results)
            return Response(serializer.data)
        except Exception as e:
            raise APIException(e)

    @action(detail=False, methods=['GET'], url_path='get_weather_from_api_GEOIP')
    def get_weather_from_api_GEOIP(self, request):
        try:
            user_ip = UserUtils.get_user_ip(request)
            service = WeatherService()
            results = service.get_weather_from_api_GEOIP(user_ip)
            serializer = WeatherSerializer(results)
            return Response(serializer.data)
        except Exception as e:
            raise APIException(e)

    @action(detail=False, methods=['POST'], url_path='save_favorite_weather')
    def save_favorite_weather(self, request):
        try:
            service = WeatherService()
            instance = service.save_favorite_weather(request.user, request.data['forecast_id'])
            if instance:
                return Response({'detail': 'success'})

            return Response({'detail': 'error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            raise APIException(e)

    @action(detail=False, methods=['PUT'], url_path='remove_favorite_weather')
    def remove_favorite_weather(self, request):
        try:
            service = WeatherService()
            service.remove_favorite_weather(request.user, request.data['forecast_id'])

            return Response({'detail': 'success'})
        except Exception as e:
            raise APIException(e)

    @action(detail=False, methods=['GET'], url_path='list_favorite_forcasts')
    def list_favorite_forcasts(self, request):
        try:
            service = WeatherService()
            favorites = service.list_favorite_forcasts(request.user)
            serializer = FavoriteForecastSerializer(favorites, many=True)

            return Response(serializer.data)
        except Exception as e:
            raise APIException(e)
