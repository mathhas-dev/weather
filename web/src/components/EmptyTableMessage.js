import React from 'react'
import {
  Message
} from 'semantic-ui-react'
//ver exemplo de uso em TabelaProposicoes.js

import { useTranslation } from "react-i18next";

const EmptyTableMessage = props => {
  const { t } = useTranslation();
  // const { data } = props
  return (
    <Message 
            icon='folder open outline' 
            header={t("No records found")} 
            content={props.content}
    />
  )
}

export default EmptyTableMessage