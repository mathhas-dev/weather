from weather.models import Weather
from core.business import BasicService
from django.db import transaction


class WeatherService(BasicService):
    queryset = Weather.objects.all()

    def list(self):
        return self.queryset.order_by('pk')

    def single(self):
        return self.list()

    def get(self, pk=None):
        if pk is None:
            raise Exception("Unable to retrieve object.")
        return self.single().get(pk=pk)

    @transaction.atomic
    def create(self, data, user=None):
        instance = ''
        return self.get(instance.pk)

    @transaction.atomic
    def update(self, instance, data, user=None):
        return self.get(instance.pk)
