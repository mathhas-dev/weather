from django.conf import settings


def template_internacionalization(default_template, user, default_language=False):
    template = default_template
    
    if default_language:
        DEFAULT_LANGUAGE = settings.LANGUAGE_CODE

        if DEFAULT_LANGUAGE.lower() == 'en':
            template = template + '_en'
        elif DEFAULT_LANGUAGE.lower() == 'pt-br':
            template = template + '_pt_br'
        elif DEFAULT_LANGUAGE.lower() == 'es':
            template = template + '_es'

    else:
        if user.preferred_language == 1:
            template = template + '_en'
        elif user.preferred_language == 2:
            template = template + '_pt_br'
        elif user.preferred_language == 3:
            template = template + '_es'

    
    return template