import React, { useEffect } from 'react'
import Page from 'pageTemplates/EmptyPage'
import LogoutContent from './LogoutContent'
import { userStore } from 'stores'

const PageLogout = props => {
  useEffect(() => {
    userStore.doLogout();
  }, [])
  return (
    <Page
      showLeftPanel
    // pagePanel={<h1>...</h1>}
    >
      <div style={{ width: '100%' }}>
        <LogoutContent />
      </div>
    </Page>
  )
}

export default PageLogout