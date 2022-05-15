from rest_framework import serializers
 
class ProfileFunctionalitiesSerializer(serializers.Serializer):
    functionalities = serializers.ListField(
        child=serializers.CharField()
    )
    can_destroy = serializers.BooleanField()
    can_list = serializers.BooleanField()
    can_retrieve = serializers.BooleanField()
    can_update = serializers.BooleanField()
 