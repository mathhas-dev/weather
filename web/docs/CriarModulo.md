# Criar Módulos

Na pasta 'modulos', clone a pasta '_template'. Cada item que contém é explicado abaixo:

### config.js

Esse arquivo contém as configurações do módulo que são acessadas mesmo quando o módulo ainda não foi carregado. As propriedades que o módulo necessita são:

1. `this.name` O alias do módulo. É utilizado internament e aparecerá na url.
1. `this.title` Título do módulo, como aparece nos menus.
1. `this.routes` A configuração das rotas (explicado em detalhe no doc [CriarPágina.md](CriarPagina.md)).
1. `this.hidden` Uma boolean. Se verdadeira, signaliza que o módulo deve ser emitido de menus.

### index.js

Este é um arquivo padrão que permite o _code splitting_ e não precisa ser modificado.

### Pastas components, pages and stores

Componentes, pastas e stores criados especificamente para esse módulo são colocados aqui. Se esses recursos são utilizáveis por outros módulos, então devem ser colocados nas respectivas pastas em 'src'.

## Conectando o novo módulo

Para que o novo módulo seja reconhecido pelo sistema, é necessário registrá-lo em 'src/Routes.js'. Primeiramente é necessário importá-lo:
```js
const NovoModulo = React.lazy(() => import('modulos/novoModulo'))
```
E em seguida adicioná-lo ao `<Switch>`em 'src/Routes.js'. É importante, porém, que o módulo *sempre seja mantido como o último*, ou ele retornará uma página 404 antes que o módulo novo seja avaliado.

```js
  <Switch>
    ...
    
    <Route
      path='/novo_modulo' // É importante que seja o mesmo nome definido no config.js do módulo
      component={novoModulo}
    />

    <Route
      path='/'
      component={Modulo}
    />
  </Switch>
```
O motivo pelo qual é necessário esse cadastro do módulo é para que o módulo seja carregado de forma 'lazy', o que possibilita o code splitting.

É também necessário cadastrá-lo em 'modulos/index.js', o que permite que seja encontrado dinâmicamente pelo sistema.