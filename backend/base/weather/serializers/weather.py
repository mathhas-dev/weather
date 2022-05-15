from weather.models import Weather
from rest_framework import serializers
import json


class WeatherSerializer(serializers.ModelSerializer):
    results = serializers.SerializerMethodField()

    class Meta:
        model = Weather
        fields = "__all__"

    def get_results(self, obj):
        results_json = json.loads(obj.results.replace("'", '"'))

        return results_json
