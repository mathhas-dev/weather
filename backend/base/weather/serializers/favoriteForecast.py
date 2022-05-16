from weather.models import FavoriteForecast
from rest_framework import serializers
from django.forms.models import model_to_dict


class FavoriteForecastSerializer(serializers.ModelSerializer):
    forecast = serializers.SerializerMethodField()

    class Meta:
        model = FavoriteForecast
        fields = "__all__"

    def get_forecast(self, obj):
        return model_to_dict(obj.forecast)
