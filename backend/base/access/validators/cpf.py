import re

from pycpfcnpj import cpf
from rest_framework import serializers


def validador_cpf(value):
    regex = r'\d{3}\.?\d{3}\.?\d{3}[\-\u2010-\u2015]?\d{2}'
    match = re.fullmatch(regex, value.strip())
    if match is None:
        raise serializers.ValidationError("Invalid CPF format. "
                                          "format must be 999.999.999-99.")
    if not cpf.validate(value):
        raise serializers.ValidationError('Invalid CPF.')


class ConsultarCpfValidator(serializers.Serializer):
    cpf = serializers.CharField(required=True, validators=[validador_cpf])
