from pycpfcnpj import cpf


class CpfResult:
    def __init__(self):
        self.cpf = None
        self.nome = None
        self.email = None


class CpfSearch:
    def __init__(self, cpf):
        self.cpf = cpf
        self.validate_cpf()

    def validate_cpf(self):
        if not cpf.validate(self.cpf):
            raise Exception("Invalid CPF.")
