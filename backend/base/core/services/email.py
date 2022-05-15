# encoding: utf-8
from core.models import MessageTemplate
import logging

from django.conf import settings
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from django.template import Template, Context

log = logging.getLogger('django.app')


class Logger:
    def __init__(self):
        self.set_logger()

    def set_logger(self, logger=None):
        self.log = logger or log


class Email(Logger):
    def __init__(self, context, **kwargs):
        super().__init__(**kwargs)
        self.context = context
        self._extra = {}
        self._url = ''
        self._to_email = []
        self._enabled = settings.EMAIL_NOTIFICATION_ENABLED
        self._subject = ''
        self._template = ''
        self._from_email = settings.DEFAULT_FROM_EMAIL

    def add_extra(self, key, value):
        self._extra[key] = value

    @property
    def dev(self):
        return settings.EMAIL_NOTIFICATION_DEV

    @property
    def enabled(self):
        return self._enabled

    @enabled.setter
    def enabled(self, value):
        self._enabled = value

    def get_context_data(self):
        data = {'object': self.context, **self._extra}
        if self._base_url:
            data['url'] = self._base_url
        data['system_name'] = settings.SYSTEM_NAME
        data['system_logo'] = settings.SYSTEM_LOGO

        return data

    @property
    def url(self):
        return self._url

    @url.setter
    def url(self, value):
        self._url = value

    @property
    def _base_url(self):
        url = ''
        if self.url:
            url = settings.FRONTEND_DNS + self.url
        return url

    @property
    def template(self):
        return self._template

    @template.setter
    def template(self, value):
        self._template = value

    @property
    def html_content(self):
        instance = MessageTemplate.objects.filter(path=self.template).first()
        context = Context(self.get_context_data())
        template = Template(instance.template)
        return template.render(context)

    @property
    def subject(self):
        return self._subject

    @subject.setter
    def subject(self, value):
        self._subject = value

    @property
    def from_email(self):
        return self._from_email

    @from_email.setter
    def from_email(self, value):
        self._from_email = value

    def add_to_email(self, email):
        self._to_email.append(email)

    @property
    def to_email(self):
        return self._to_email

    @to_email.setter
    def to_email(self, value):
        self._to_email = value

    def send(self):
        try:
            if self.enabled and len(self.to_email) >= 1:
                message = Mail(
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    to_emails=self.to_email,
                    subject=self.subject,
                    html_content=self.html_content)
                sender = SendGridAPIClient(settings.SENDGRID_API_KEY)
                sender.send(message)
            else:
                self.log.warning('EMAIL, CANT SEND: %s - (DISABLED: %s) - (TO: %s)',
                                 self.context.id, not self.enabled, self.to_email)
        except Exception as e:
            self.log.error('EMAIL ERROR: %s, %s', self.context.id, e)
