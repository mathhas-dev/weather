import React, { useState, useEffect } from 'react'
import { useHistory } from "react-router-dom"
import {
  Button, Form, Grid, Header, Modal, Icon, Message, Divider,
} from 'semantic-ui-react'
import { observer } from 'mobx-react'
import { userStore, passwordStore } from 'stores'
import { fieldError } from 'utils'

const LoginForm = observer((props) => {
  const history = useHistory();
  const { logged } = userStore;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const onLogin = (e) => {
    userStore.login({
      'username': username,
      'password': password
    })
  };
  useEffect(() => {
    if (userStore.logged === true) {
      history.push('/')
    }
  }, [logged, history]);

  const callResetPassApi = () => {
    passwordStore.newPassword(email);
  }

  const callRegistrateYourself = () => {
    passwordStore.registrateYourself(email, name);
  }

  return (
    <Grid textAlign='center' style={{ height: '80vh' }} verticalAlign='middle'>

      <Grid.Column style={{ maxWidth: 450 }}>

        <Header as='h2' color='teal' textAlign='center'>
          Login
        </Header>

        <Message
          hidden={userStore.message === null}
          {...userStore.message}
        />

        <Form size='large'>
          <Form.Input
            fluid icon='user'
            iconPosition='left'
            id='LoginForm'
            placeholder='Registration'
            error={userStore.getError('username')}
            onChange={e => setUsername(e.target.value)}
          />
          <Form.Input
            fluid
            icon='lock'
            iconPosition='left'
            id='LoginForm_Password'
            placeholder='Password'
            type='password'
            error={userStore.getError('password')}
            onChange={e => setPassword(e.target.value)}
          />

          <Button color='teal' id='LoginForm_Enter' fluid size='large' onClick={onLogin}>
            Enter
          </Button>

        </Form>


        <Modal
          onClose={() => passwordStore.reset()}
          trigger={
            <Button basic style={{ boxShadow: 'none' }} >
              First Login/Forgot My Password
            </Button>
          }
          size='small' closeIcon
        >
          <Modal.Header icon='address card outline'
            content='Password recovery / first access' />
          <Modal.Content>

            <Message
              hidden={passwordStore.message === null}
              {...passwordStore.message}
            />

            <Form>

              {
                passwordStore.error ?
                  <>
                    <Divider />

                    <Form.Input
                      fluid
                      icon='address card outline'
                      iconPosition='left'
                      placeholder='Insert your e-mail to registrate yourself'
                      label='E-mail'
                      error={fieldError(passwordStore.error, 'email')}
                      onChange={e => setEmail(e.target.value)}
                    />

                    <Form.Input
                      fluid
                      icon='address card outline'
                      iconPosition='left'
                      placeholder='Insert your name to registrate yourself'
                      label='Name'
                      error={fieldError(passwordStore.error, 'name')}
                      onChange={e => setName(e.target.value)}
                    />
                  </>
                  :
                  <Form.Input
                    fluid
                    icon='address card outline'
                    iconPosition='left'
                    placeholder='E-mail'
                    label='E-mail'
                    error={fieldError(passwordStore.error, 'email')}
                    onChange={e => setEmail(e.target.value)}
                  />
              }

            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button primary onClick={passwordStore.error ? callRegistrateYourself : callResetPassApi}
              loading={passwordStore.loading}>
              <Icon name='checkmark' /> Enviar
            </Button>
          </Modal.Actions>
        </Modal>
      </Grid.Column>
    </Grid>
  )
});


export default LoginForm
