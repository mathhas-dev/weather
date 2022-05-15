import React from 'react'
import { ChangePasswordForm } from '../components'
import Page from 'pageTemplates/EmptyPage'

const ChangePassword = props => {
  const { match: {params:{token}}} = props;
  return (
    <Page
      showLeftPanel
      // pagePanel={<h1>...</h1>}
    >
      <div style={{ width: '100%' }}>
        <ChangePasswordForm token={token}/>
      </div>
    </Page>
  )
}

export default ChangePassword
