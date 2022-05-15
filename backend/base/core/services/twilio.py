from twilio.rest import Client

from django.conf import settings


class SMSService:
    TWILIO_ACCOUNT_SID = settings.TWILIO_ACCOUNT_SID
    TWILIO_AUTH_TOKEN = settings.TWILIO_AUTH_TOKEN
    TWILIO_SENDER = settings.TWILIO_SENDER
    DEBUG = settings.DEBUG

    def __init__(self):
        self.client = Client(self.TWILIO_ACCOUNT_SID, self.TWILIO_AUTH_TOKEN)

    def send(self, numero, mensagem):
        if self.DEBUG:
            print(mensagem)
            return True
        message = self.client.messages.create(
            to=f'+{numero}',
            from_=self.TWILIO_SENDER,
            body=mensagem)
        return True
