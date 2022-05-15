class BasicService:
    """
    Classe a ser extendida por todas as classes do tipo Business.
    """
    def list(self, user, *args, **kwargs):
        raise NotImplementedError("LIST is not available")

    def single(self, pk, *args, **kwargs):
        raise NotImplementedError("GET, UPDATE AND REMOVE are not available")

    def get(self, pk, *args, **kwargs):
        raise NotImplementedError("GET is not available")

    def create(self, data, user, *args, **kwargs):
        raise NotImplementedError("CREATE is not available")

    def update(self, instance, data, user, *args, **kwargs):
        raise NotImplementedError("UPDATE is not available")

    def remove(self, instance, user, *args, **kwargs):
        raise NotImplementedError("REMOVE is not available")

