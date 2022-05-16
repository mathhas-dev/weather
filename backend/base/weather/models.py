from django.db import models
from core.db import BaseModel
from core.models import User


class Weather(BaseModel):
    woeid = models.CharField(max_length=100)  # <City code>
    city = models.CharField(max_length=100)  # <City name, State>
    results = models.TextField()


class Forecast(BaseModel):
    weather = models.ForeignKey(Weather, on_delete=models.PROTECT)
    year = models.IntegerField()
    # I chose this way to store date, because this is the format from API: dd/mm
    # And will be used to compare with newest forecast's
    date = models.CharField(max_length=5)
    weekday = models.CharField(max_length=10)
    max = models.IntegerField()
    min = models.IntegerField()
    description = models.CharField(max_length=255)
    condition = models.CharField(max_length=20)


class FavoriteForecast(BaseModel):
    forecast = models.ForeignKey(Forecast, on_delete=models.PROTECT)
    user = models.ForeignKey(
        User, related_name='favorite_weather_user', on_delete=models.PROTECT)
