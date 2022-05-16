# Backend

Sistema operacional recomendado: Linux (Ubuntu 20.0.4 ou outra distro)
IDE recomendada: Visual Studio Code

### Instruções para instalação:  

* Abra a pasta "backend" no terminal
* Crie um ambiente virtual para compilar o projeto: 
```
python3 -m venv env
```
ou
* Execute o ambiente virtual no terminal:
```
source env/bin/activate
```

* Instale as bibliotecas utilizadas no projeto: 
```
cd base
pip install -r requirements.txt
```

* Contrua a estrutura do banco dados pelo framework Django Rest:
```
python3 manage.py migrate
```

* Para executar:
```
python3 manage.py runserver
```
(Ou Simplesmente execute pelo modo debug do VSCode)  

* Popule o banco de dados com os dados iniciais preparados:
```
python manage.py initdata
```

* No arquivo: ".vscode/settings.json" está a especificação do projeto, para que o interpretador compreenda que os arquivos utilizados/criados estão na pasta "base". Para utilizar outra IDE, copie esse arquivo para o diretório principal, caso o interpretador não identifique os imports.  

* Super usuários são passados por alto para o django-guardian, para realizar testes válidos, criar usuários manualmente

Referencia de WOEID: https://muftsabazaar.com/blog/post/list-of-woeid-codes-of-brazil

* Para encontrar os apps desenvolvidos acesse a pasta "base"

### Case se depare com algum ao instalar o psycopg, certifique-se ter ter o postgres instalado, ou execute o seguinte comando:
```
sudo apt-get install libpq-dev python-dev
```

### ER Diagram:
![erdiagram](https://user-images.githubusercontent.com/56370296/168668284-4a3ae670-85ee-41c9-a8b9-c7b9384c715e.png)
