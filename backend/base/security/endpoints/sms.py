from rest_framework.decorators import api_view
from random import randint
from core.services.twilio import SMSService
from core.models import User
from rest_framework import status
from rest_framework.exceptions import APIException
from rest_framework.response import Response


@api_view(['POST'])
def GetSmsTokenLogin(request):
    try:
        phone = request.data['phone']
        token = str(randint(10000, 99999))

        service = SMSService()
        message = f"Access code: {token}."

        send = service.send(phone, message)

        if send:
            request.session['token_sms'] = token
            request.session['phone_number'] = phone
            return Response({'token': True}, status=status.HTTP_200_OK)

    except Exception as e:
        raise APIException(e)


@api_view(['POST'])
def GetSmsToken2FA(request):
    try:
        phone = f"{request.user.country_code_number}{request.user.phone}"
        token = str(randint(10000, 99999))

        service = SMSService()
        message = f"Access code: {token}."

        send = service.send(phone, message)

        if send:
            request.session['token_sms'] = token
            return Response({'token': 'Sent'}, status=status.HTTP_200_OK)

    except Exception as e:
        raise APIException(e)
