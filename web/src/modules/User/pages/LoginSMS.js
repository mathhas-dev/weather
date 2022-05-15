import React from 'react'
import { LoginSMSForm } from '../components'
import Page from 'pageTemplates/EmptyPage'

const LoginSMS = props => {
    return (
        <Page
            showLeftPanel
        >
            <div style={{ width: '100%' }}>
                <LoginSMSForm />
            </div>
        </Page>
    )
}

export default LoginSMS
