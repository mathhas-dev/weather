from core.db import BaseModel
from django.db import models


class Weather(BaseModel):
    woeid = models.CharField(max_length=100) # <City code>
    city = models.CharField(max_length=100) # <City name, State>
    results = models.TextField()
