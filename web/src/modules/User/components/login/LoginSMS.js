import React, { useState, useEffect } from 'react'
import { useHistory } from "react-router-dom"
import {
    Button, Form, Grid, Header, Message, Popup,
} from 'semantic-ui-react'
import { observer } from 'mobx-react'
import { userStore } from 'stores'



const InsertToken = observer(() => {
    const [token_sms, setTokenSMS] = useState('');

    const onLogin = (e) => {
        userStore.loginSMS({
            'username': 'smslogin',
            'password': 'smslogin',
            'token_sms': token_sms,
            'phone_number': userStore.phone_number
        })
    };

    return (
        <>
            <Form.Input
                fluid icon='privacy'
                iconPosition='left'
                placeholder='Insert the SMS token here...'
                error={userStore.getError('phone')}
                onChange={e => setTokenSMS(e.target.value)}
            />
            <Button color='teal' fluid size='large' onClick={onLogin}>
                Enter
            </Button>
        </>
    )
})

const RequestSmsToken = observer(() => {
    const [phone_number, setPhoneNumber] = useState('');

    const send_sms = () => {
        userStore.sendSmsToken(phone_number);
    }

    return (
        <>
            <Popup
                content="Insert the country code,  area code and phone number"
                trigger={
                    <Form.Input
                        fluid icon='phone'
                        iconPosition='left'
                        placeholder='Insert the cell phone here...'
                        error={userStore.getError('phone')}
                        onChange={e => setPhoneNumber(e.target.value)}
                    />
                }
            />
            <Button color='teal' fluid size='large' onClick={send_sms}>
                Send SMS token!
            </Button>
        </>
    )
})

const LoginSMSForm = observer((props) => {
    const history = useHistory();
    const { logged } = userStore;

    useEffect(() => {
        if (userStore.logged === true) {
            history.push('/')
        }
    }, [logged]);

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
                    {
                        userStore.sms_token_sent
                            ?
                            <InsertToken />
                            :
                            <RequestSmsToken />
                    }
                </Form>
            </Grid.Column>
        </Grid>
    )
});


export default LoginSMSForm
