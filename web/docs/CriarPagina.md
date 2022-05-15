# Criar páginas

Cada página deve utilizar uma ["page template"](CriarPageTemplate.md) como wrapper para seu conteúdo. A page template definirá a estrutura da página, menus, footers, asides etc, além de receber, via atributos, as configurações da página.

Segue um exemplo de utilização hipotético:

```js
import Page from 'pageTemplates/TemplateHipotetico'

const PaginaExemplo = props =>
  <Page
    corDoMenu='vermelho'
    ocultarBreadcrumb
  >
    {/* O conteúdo da página é adicionado aqui.*/}
  </Page>
```
Os template de página usufruem, propositadamente, de grande liberdade para definir a aparência e nos atributos de configuração que recebem. Todo template deve possuir um doc, e é importante lê-lo para se familiarizar com os atributos que o template aceita.

## Registrando a página

Em seguida é necessário registrar a página no arquivo 'config.js' do módulo. Neste arquivo será definida a rota da página, bem como quaisquer dados sobre a página que sejam necessários antes que a página seja carregada (eg. nome, ícone...).

No atributo `this.routes` do módulo (em config.js), adicione um novo objeto para o módulo. As propriedades necessárias a este são:

1. `path` A url que dará acesso à página. Ele *precisa* começar com _\`/${this.name}`_ ou não chegará a ser carregada.
1. `exact` Bool. Determina se o 'path' deve ser um match exato com a url. Se false, qualquer texto além do path (por exemplo, '/modulo/paginaJDFCVJK' ao invés de '/modulo/pagina') fará referência a essa página.
1. `title` O nome da página que será mostrado em menus, breadcrumbs e afins.
1. `parent` O 'path' da página considerada ancestral imediato. É utilizado na construção do breadcrumb.
1. `hidden` Bool. Se true, essa página não será listada em menus, breadcrumbs e afins.
1. `public` Bool. Se true, o usuário não precisará estar logado para acessar a página. Se false, usuário não logados serão redirecionados à página de login.
1. `component` Uma referência ao componente da página a ser carregado.

[Meta informações que só precisem ser acessadas quando a página está carregada geralmente são passadas como atributos do 'page template', enquanto meta informações que precisem ser acessadas pelo sistema, fora da página, podem ser adicionados no config.js]