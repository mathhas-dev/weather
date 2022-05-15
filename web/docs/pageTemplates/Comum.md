# Comum.js

Este template foi criado para a página típica do sistema. Ele prevê breakpoints em 700 e 1200px delimitando formatos 'mobile', 'tablet' e 'desktop'.

# Atributos

O template Comum espera receber as seguintes propriedades:

1. `buttons` Os botões de ação da página (salvar, cancelar, deletar). Deve ser um array com os componentes ordenados segundo a importância.
1. `panelContent` Recebe componentes que serão colocados no painel lateral. O principal caso de uso é para filtros, mas pode ser utilizado para outros conteúdos secundários, se necessário.
1. `panelIcon` Define o ícone que identificará o painel lateral direito quando, em layouts 'tablet' e 'mobile', ele estiver fechado. O ícone default é 'content' ("menu de hamburguer").
1. `panelTitle` Define o label do painel inferior em layout 'mobile'. Se omitido, nenhum texto é apresentado.

# Propriedades passadas aos filhos

A página template injetará as seguintes propriedades em seus filhos:

1. `data-inner-width` A largura em pixels disponível para o conteúdo da página (descontados os painéis laterais e o padding).
1. `layout` O layout utilizado pelo template em razão da largura da janela. As opções são 'mobile', 'tablet' ou 'desktop'.

Perceba que para ter acesso às propriedades injetadas, é preciso declarar o código como um componente. Por exemplo:

```js
const MyPage = props =>
  <Page>
    <div>{data-inner-width}</div>{/* Não funciona: resulta em erro. */}
  </Page>
```
Ao invés disso declare o conteúdo como um elemento independente.

```js
const ConteudoIntenro = props =>
  <div>{props['data-inner-width']}</div>

const MyPage = props =>
  <Page>
    <ConteudoIntenro />{/* Funciona corretamente. */}
  </Page>
```

## Estrutura da página

1. Um menu de navegação vertical à esquerda. No layout 'tablet', o menu se torna uma barra que esconde o menu em uma gaveta. No layout 'mobile' a barra torna-se horizontal e é movida para o topo.

1. Uma área central que contém o breadcrumb acima, o conteúdo da página ao centro, e um footer para os botões de ação da página.

1. Um painél lateral direito vertical, que contém um botão de usuário (que revela um painel da configurações de usuário) e um painel para filtros ou aside. No formato 'tablet', o painel de filtros fica escondido em uma gaveta. No formato 'mobile', a barra é movida para baixo na tela. Ainda no modo 'mobile', o menu de usuário fica no topo da tela (desta forma está sempre no canto superior direito).