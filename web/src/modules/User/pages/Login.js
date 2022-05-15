import React from 'react'
import { LoginForm } from '../components'
// import Page from 'pageTemplates/MainPage'
import Page from 'pageTemplates/EmptyPage'

const Login = props => {
  return (
    <Page
      showLeftPanel
      // pagePanel={<h1>...</h1>}
    >
      <div style={{ width: '100%' }}>
        <LoginForm />
      </div>
    </Page>
  )
}

export default Login
