import React, { useState, useEffect } from 'react'
import { Button, Form, Grid, Header, Message } from 'semantic-ui-react'
import { useHistory } from "react-router-dom"
import { observer } from 'mobx-react'
import { userStore, passwordStore } from 'stores'
import { fieldError } from 'utils'

import { useTranslation } from "react-i18next";

const ChangePasswordForm = observer(({ token }) => {
  const history = useHistory();
  const { logged } = userStore;
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    if (userStore.logged === true) {
      history.push('/')
    }
  }, [logged, history]);

  const callChangePassApi = (e) => {
    if (senha === '') {
      passwordStore.error = { 'new': t("This field cannot be blank.") };
      return;
    }
    if (senha !== confirmarSenha) {
      passwordStore.error = { 'new_fix': t("Password confirmation does not match.") };
      return;
    }
    passwordStore.changePassword(senha, confirmarSenha);
  }

  useEffect(() => {
    passwordStore.token = token;
  }, [token]);

  return (
    <Grid textAlign='center' style={{ height: '80vh' }} verticalAlign='middle'>
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as='h2' color='teal' textAlign='center'>
          Change Password
        </Header>
        <Message
          hidden={passwordStore.message === null}
          {...passwordStore.message}
        />
        <Form size='large'>
          <Form.Input
            fluid icon='lock'
            iconPosition='left'
            placeholder={t("New password")}
            type='password'
            error={fieldError(passwordStore.error, 'new')}
            onChange={e => setSenha(e.target.value)}
          />
          <Form.Input
            fluid
            icon='lock'
            iconPosition='left'
            placeholder={t("Confirm new password")}
            type='password'
            error={fieldError(passwordStore.error, 'new_fix')}
            onChange={e => setConfirmarSenha(e.target.value)}
          />
          <Button color='teal' fluid size='large'
            onClick={callChangePassApi}
            loading={passwordStore.loading}>
            Enter
          </Button>
        </Form>
      </Grid.Column>
    </Grid>
  )
});


export default ChangePasswordForm
