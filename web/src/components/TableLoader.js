import React from 'react'
import {
  Loader, Dimmer
} from 'semantic-ui-react'
//ver exemplo de uso em TabelaProposicoes.js
const TableLoader = props => {
  return(
    <Dimmer.Dimmable dimmed={ props.active }>
    <Dimmer active={ props.active }> 
      <Loader>Carregando...</Loader> 
    </Dimmer>
      {props.children}
    </Dimmer.Dimmable>
  )
}

export default TableLoader