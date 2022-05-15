from core.db import BaseModel
from core.models import User
from django.db import models


class Profile(BaseModel):
    name = models.CharField(max_length=100)
    name_alias = models.CharField(unique=True, max_length=50)


class Functionality(BaseModel):
    name = models.CharField(max_length=100)
    name_alias = models.CharField(unique=True, max_length=50)


class ProfileFunctionality(BaseModel):
    profile = models.ForeignKey('Profile', on_delete=models.PROTECT)
    functionality = models.ForeignKey(
        'Functionality', on_delete=models.PROTECT)

    class Meta:
        unique_together = (('functionality', 'profile'),)


class Enablement(BaseModel):
    profiles = models.ManyToManyField('Profile', related_name="profiles")
    active_profile = models.ForeignKey(
        'Profile', on_delete=models.PROTECT, related_name="active_profile")
    user = models.OneToOneField(
        User, related_name='enablement_user', on_delete=models.PROTECT)
    registration_user = models.ForeignKey(
        User, related_name='enablement_registration_user', on_delete=models.PROTECT)


class ManagementProfile(BaseModel):
    profile_manager = models.ForeignKey(
        'Profile', related_name='profile_manager', on_delete=models.PROTECT)
    profile_managed = models.ForeignKey(
        'Profile', related_name='profile_managed', on_delete=models.PROTECT)

    class Meta:
        unique_together = (('profile_manager', 'profile_managed'),)
