from weather.models import Weather
from rest_framework import serializers


class WeatherValidator(serializers.ModelSerializer):
    woeid = serializers.CharField(max_length=100)
    city = serializers.CharField(max_length=100)
    results = serializers.CharField()

    class Meta:
        model = Weather
        fields = ["woeid", "city", "results"]

    def validate(self, data):
        """
        Validates weather
        """
        # user = self.context.get('request').user

        return data
