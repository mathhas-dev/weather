# Criar Stores

Este doc explica um padrão para criação de stores no Base, mas ele não é mandatório. As várias stores do sistema têm necessidades diferentes e, portanto, podem ser criadas aderindo parcialmente ao padrão, ou mesmo desconsiderá-lo, de acordo com a necessidade.

## Conceito
As stores contêm quatro _tipos_ de propriedades. O objetivo deste padrão é separar esses tipos de forma a facilitar a compreensão da store. Os tipos são:

1. `dados` ou modelo. São os dados que devem ser persistidos na DB, e que são passados pelo Rest. São preferencialmente compreendidos por ids, alias e strings.
1. `dominio`. Incluem todas as opções possíveis em uma seleção (por exemplo, todos níveis de prioridade, ou todos os ministérios), bem como as informações necessárias para renderizar os dados de uma forma humanizada. Por exemplo, os `dados` contém o id do ministério selecionado enquanto o `dominio` traz as informações para traduzir esse id em um nome ou sigla.
1. `ui` ou dados efêmeros. São os dados que não precisam ser persistidos na base de dado, representando um estado local dos componentes. Esses dados incluem, por exemplo, se o componente está num estado de loading ou se um menu está aberto ou fechado.
1. `metodos`. São as funções responsáveis em atualizar os dados ou facilitar o acesso a eles.

## Estruturando a store
Abaixo está um exemplo simples, porém completo, de uma store:
```javascript
import { observable, action } from 'mobx'

// Dados são declarados como um objeto com valores default.
// Isso facilita resetar os valores mais tarde.
const dados = {
    id: null,
    texto: '',
    opcoes: [],
}

// Dados efêmeros também são declarados como um objeto.
const ui = {
    painelAberto: false
}

// Domínios também são declarados como objetos
const dominio = {
    opcoes: []
}

// Em seguida cria-se a store...
const exampleStore = observable({
    dados,
    dominio,
    ui,

    // ... e os métodos são declarados diretamente dentro da store (simplificando o uso do "this").
    reset () {
        Object.assign(this.dados, dados)
    }
    salvar () {
        fetch('/save', {
            method: 'POST',
            body: JSON.stringify(this.dados)
        })
    }
    async carregar () {
        const content = await fetch('/dados')
        this.dados = content.json()
    }
    addOpcoes () {
        this.dominio.push({ nome: 'nova opcao' })
    }
},
// Por fim, todos os métodos que acessam dados da store (this) devem
// ser declarados como action.bound
{
    addOpcoes: action.bound,
    carregar: action.bound,
    reset: action.bound,
    salvar: action.bound,
})

export default exampleStore
```

## Observações e debug

### O `this` funcionará se o método for "bound".
Ao declarar um método que edite os dados da store, é necessário conectá-lo ao `this` da store. Isso é feito passando-se um segundo argumento para a função `observable`, conforme o exemplo abaixo.
```javascript
import { observable, action } from 'mobx'

const store = {...}

observable(store, {
    myMethod: action.bound
})
```
-
### Mas você não pode usar `this` na declaração do objeto.
> Por exemplo, `const dados = { a: 1, b: this.a + 2 }` não funcionará. Se necessário, você pode criar um getter para atingir esse resultado.
-
### O objeto "dados" no exemplo acima mantém o valor default - o objeto adicionado a this.dados é um clone criado pelo mobx.
> Você não _precisa_ criar os dados, ui e dominio como objetos, mas ele permite facilmente reiniciar o valor dos dados.