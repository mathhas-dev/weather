import requests
from weather.models import FavoriteWeather, Forecast, Weather
from core.business import BasicService
from django.db import transaction
from django.conf import settings
from django.utils import timezone


class WeatherService(BasicService):
    queryset = Weather.objects.all()
    API_URL = settings.HGBRASIL_WEATHER_URL

    def list(self):
        return self.queryset.order_by('pk')

    @transaction.atomic
    def get_weather_from_api_WOEID(self, woeid):
        # This method will get and save the data from API

        url = f"{self.API_URL}?woeid={woeid}"

        data = requests.get(url).json()

        instance = self.save_weather(data)

        return self.get(instance.pk)

    @transaction.atomic
    def get_weather_from_api_GEOIP(self, user_ip):
        # This method will get and save the data from API

        if settings.DEBUG:
            # Remote is used to select the client IP according to HGBrasil Weather API
            url = f"{self.API_URL}?key={settings.HGBRASIL_WEATHER_KEY}&user_ip=remote"
        else:
            url = f"{self.API_URL}?key={settings.HGBRASIL_WEATHER_KEY}&user_ip={user_ip}"

        data = requests.get(url).json()

        instance = self.save_weather(data)

        return self.get(instance.pk)

    def single(self):
        return self.list()

    def get(self, pk=None):
        if pk is None:
            raise Exception("Unable to retrieve object.")
        return self.single().get(pk=pk)

    @transaction.atomic
    def save_weather(self, data):
        instance, created = Weather.objects.update_or_create(
            city=data['results']['city'], defaults={'results': data['results']}
        )

        forecasts = instance.results['forecast']

        for day in forecasts:
            self.save_forecast(instance, day)

        return instance

    def save_forecast(self, weather, data):
        year = timezone.now().year

        instance, created = Forecast.objects.update_or_create(
            weather=weather, year=year, date=data['date'], defaults={
                'weekday': data['weekday'], 'max': data['max'], 'min': data['min'], 
                'description': data['description'], 'condition': data['condition']}
        )
        return instance
