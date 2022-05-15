# encoding: utf-8
from rest_framework import serializers


class ResetPasswordValidator(serializers.Serializer):
    email = serializers.EmailField(required=True)


class NewPasswordValidator(serializers.Serializer):
    new = serializers.CharField(required=True)
    new_fix = serializers.CharField(required=True)
    token = serializers.CharField(required=True)

    def validate(self, data):
        if data['new'] != data['new_fix']:
            raise serializers.ValidationError({'new_fix':
                'Confirmação de senha não confere.'
                })
        return data

