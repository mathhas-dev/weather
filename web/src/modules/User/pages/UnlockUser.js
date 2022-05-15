import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { observer } from 'mobx-react'
import { userStore } from '../stores'
import {
  Header, Icon, Button, Message, List, Table, Label,
} from 'semantic-ui-react';
import Page from 'pageTemplates/MainPage'

import { useTranslation } from "react-i18next";

const keys = {
  nomeCargo:'Cargo',
  nomeOrgao:'Órgão',
  nomeFuncao:'Função',
  nomeAtivFun:'Ativação do Funcionário',
  nomeNovaFuncao:'Nova Função',
  nomeUorgLotacao:'Uorg da Lotação',
  nomeSitFuncional:'Situação Funcional',
  nomeOcorrExclusao:'Ocorrência de Exclusão',
  nomeUorgExercicio:'Uorg de Exercício',
  nomeOcorrAposentadoria:'Ocorrência de Aposentadoria',
};

const diffSingleSiape = (source, target) => {
  const diff = {};
  for (let key in keys) {
    const _d1 = source.hasOwnProperty(key) ? source[key] : null;
    const _d2 = target.hasOwnProperty(key) ? target[key] : null;
    diff[key] = {
      changed: _d1 !== _d2,
      source: _d1,
      target: _d2,
    };
  }
  return diff;
};

const diffListSiape = (source, target) => {
  const max = source.length > target.length ?
    source.length : target.length;
  let diffs = [];
  for (let i = 0; i < max; i++) {
    const _source = i < source.length ? source[i] : {};
    const _target = i < target.length ? target[i] : {};
    const diff = diffSingleSiape(_source, _target);
    if (diff !== {}) diffs.push(diff);
  }
  return diffs;
};

const DiffSet = observer(({diff}) => {
  return (
    <Table definition celled compact>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell/>
          <Table.HeaderCell>Voltalia</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {
          Object.keys(diff).map(key => {
            const item = diff[key];
            return (
              <Table.Row warning={item.changed}>
                <Table.Cell>
                  {keys[key]}</Table.Cell>
                <Table.Cell>{item.source}</Table.Cell>
                <Table.Cell>{item.target}</Table.Cell>
              </Table.Row>
            );
          })
        }
      </Table.Body>
    </Table>
  );
});


const MotivoBloqueio = observer(() => {
  const { dados } = userStore;
  if (!dados.hasOwnProperty('motivos_block') || dados.motivos_block.length === 0)
    return null;
  else if (dados.motivos_block.length === 1)
    return <Header as='h3' textAlign='center'>{dados.motivos_block[0]}</Header>;
  else {
    return (
      <>
        <Header as='h3' textAlign='center'>Blocked user</Header>
        Reasons for blocking:
        <List divided>
          {
            dados.motivos_block.map(motivo =>
              <List.Item>{motivo}</List.Item>
            )
          }
        </List>
      </>
    );
  }
});

const PageButtons = observer(() => {
  const history = useHistory();

  const handleUnlock = () => {
    userStore.unlock();
  };

  const handleBack = () => {
    history.goBack();
  };

  const { t } = useTranslation();

  return (
    <List>
      <List.Item>
        <Button onClick={handleUnlock} loading={userStore.saving}
          primary fluid>
          <Icon name='lock open' /> {t("Unlock")}
        </Button>
      </List.Item>
      <List.Item>
        <Button onClick={handleBack} fluid>
          <Icon name='arrow left' /> {t("Back")}
        </Button>
      </List.Item>
    </List>
  );
});

const UnlockUser = observer((props, alfa) => {
  const { match: {params:{id}}} = props;
  const { dados } = userStore;

  useEffect(() => {
    userStore.reset();
  },[]);

  useEffect(() => {
    if (id) userStore.getUnlock(id)
  },[id]);

  return (
    <Page pagePanel={<PageButtons />}>
      <Header as='h1'>Unlock User</Header>
      <Message
        hidden={userStore.message === null}
        {...userStore.message}
      />
      <MotivoBloqueio />
      <List divided>
        <List.Item>
          <Label horizontal>CPF</Label>
          {dados.username}
        </List.Item>
        <List.Item>
          <Label horizontal>Nome</Label>
          {dados.name}
        </List.Item>
      </List>
    </Page>
  )
});

export default UnlockUser
