from django.db import models
from django.utils import timezone
import uuid

NOW = timezone.now


class Manager(models.Manager):
    def get_queryset(self):
        qs = super().get_queryset()
        return qs.filter(is_active=True)


class AutoDateTimeField(models.DateTimeField):
    def pre_save(self, model_instance, add):
        return timezone.now()


class BaseModel(models.Model):
    date_update = AutoDateTimeField(default=NOW)
    date_create = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    uuid = models.UUIDField(default=uuid.uuid4)
    objects = Manager()

    class Meta:
        abstract = True

    def delete(self, *args, **kwargs):
        self.is_active = False
        self.save()

    def hard_delete(self, *args, **kwargs):
        super().delete()

