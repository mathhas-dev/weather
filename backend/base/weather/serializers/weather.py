from weather.models import Forecast, Weather
from rest_framework import serializers
from django.forms.models import model_to_dict
import json


class WeatherSerializer(serializers.ModelSerializer):
    results = serializers.SerializerMethodField()
    forecast = serializers.SerializerMethodField()

    class Meta:
        model = Weather
        fields = "__all__"

    def get_results(self, obj):
        results_json = json.loads(obj.results.replace("'", '"'))

        return results_json

    def get_forecast(self, obj):
        forecasts = Forecast.objects.filter(weather=obj).order_by('date_create')[:9]

        forecast = []

        for item in forecasts:
            forecast.append(model_to_dict(item))

        return forecast
