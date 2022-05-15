import logging
from rest_framework.decorators import action
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.serializers import SerializerMethodField
from access.business import FunctionalityService
from core.serializers import ProfileFunctionalitiesSerializer

log = logging.getLogger('django.app')


class ResourceCore(viewsets.GenericViewSet):
    def get_permissions(self):
        if IsAuthenticated not in self.permission_classes:
            self.permission_classes = [
                IsAuthenticated] + list(self.permission_classes)
        return super(viewsets.GenericViewSet, self).get_permissions()

    def __init__(self, *args, **kwargs):
        self.set_logger()

    def set_logger(self, logger=None):
        self.log = logger or log
    
    @action(detail=False, methods=['get'])
    def retrieve_permissions(self, request):
 
        resource = request.path.split('/')[3]
        service = FunctionalityService()
 
        profile_functionalities = service.get_access(request.user, resource)

        serializer = ProfileFunctionalitiesSerializer(profile_functionalities)
        return Response(serializer.data)


class ResourcePublicCore(viewsets.GenericViewSet):

    def __init__(self, *args, **kwargs):
        self.set_logger()

    def set_logger(self, logger=None):
        self.log = logger or log


class ValidatorMixin:
    """
    Mixin para adicionar um atributo de classe chamado validator_class.
    O atributo validator_class deve ser sobrescrito ou o método
    get_validator_class(), retornado uma classe para validação de input.
    """

    # Classe a ser instanciada para validação das entradas no create e update.
    validator_class = None

    def get_validator(self, *args, **kwargs):
        validator_class = self.get_validator_class()
        kwargs['context'] = self.get_serializer_context()
        return validator_class(*args, **kwargs)

    def get_validator_class(self):
        if self.action in ['create', 'update'] and self.validator_class:
            return self.validator_class
        return self.get_serializer_class()


class BusinessMixin:
    """
    Mixin para adicionar um atributo de classe chamado business_class.
    O atributo business_class deve ser sobrescrito ou o método
    get_business_class(), retornado uma classe que herda de
    core.business.BasicService.
    """

    # Classe a ser instanciada para validação das entradas no create e update.
    business_class = None

    def get_business(self, *args, **kwargs):
        business_class = self.get_business_class()
        return business_class(*args, **kwargs)

    def get_business_class(self):
        assert self.business_class is not None, (
            "'%s' deve incluir um atributo business_class ou "
            "sobrescrever o método get_business_class()."
            % self.__class__.__name__
        )
        return self.business_class


class ModelCrud(ValidatorMixin,
                BusinessMixin,
                viewsets.ModelViewSet):
    """
    Classe para facilitar a criação de CRUDs a partir de classes do modelo
    de dados.
    """

    def get_queryset(self, *args, **kwargs):
        s = self.get_business()
        # Caso esteja buscando objeto simples e exista um método single,
        # utiliza ele, caso contrário, utiliza list.
        if (hasattr(self, 'getting_object') and
            self.getting_object is True and
                hasattr(s, 'single')):
            self.queryset = s.single()
        else:
            self.queryset = s.list()
        return super().get_queryset()

    def get_object(self):
        self.getting_object = True
        obj = super().get_object()
        self.getting_object = False
        return obj

    def create(self, request):
        # Valida o input dos dados para criação
        validator = self.get_validator(data=request.data)
        validator.is_valid(raise_exception=True)
        # Cria nova instância a partir de dados
        service = self.get_business()
        new_instance = service.create(
            validator.validated_data, self.request.user)
        # Serializa nova instância
        serializer = self.get_serializer(new_instance)
        return Response(serializer.data)

    def update(self, request, pk=None):
        # Recupera instância a ser atualizada
        instance = self.get_object()
        # Valida o input dos dados para atualização
        validator = self.get_validator(instance, data=request.data)
        validator.is_valid(raise_exception=True)
        # Atualiza instância recuperada com os novos dados
        service = self.get_business()
        updated_instance = service.update(
            instance, validator.validated_data, self.request.user)
        # Serializa instância atualizada
        serializer = self.get_serializer(updated_instance)
        return Response(serializer.data)

    def destroy(self, request, pk=None):
        # Recupera instância a ser removida
        instance = self.get_object()
        # Remove a instância
        service = self.get_business()
        service.remove(instance)
        # Serializa instância removida
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

class MethodField(SerializerMethodField):
    """
    Classe para permitir usar o SerializerMethodField com parametros
    """
    def __init__(self, method_name=None, **kwargs):
        # use kwargs for our function instead, not the base class
        super().__init__(method_name) 
        self.func_kwargs = kwargs

    def to_representation(self, value):
        method = getattr(self.parent, self.method_name)
        return method(value, **self.func_kwargs)
