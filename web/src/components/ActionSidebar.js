import React from 'react'
import { /*Icon*/ Segment } from 'semantic-ui-react'
import { observer } from 'mobx-react';
// import { userStore } from 'stores'
import { UserLoginButton } from 'components'
import './ActionSidebar.less'

const sideSegmentStyle = {
  background: 'var(--violet)',
  border: 'none',
  borderRadius: 8,
  boxShadow: 'none'
}

const SiteActionPanel = observer(props => {
  const { onClickUser } = props
  
  return (
    <UserLoginButton
      onClick={onClickUser}
    />
  )
});

const PageActionPanel = props => 
  props.children || props.negativePanel
    ? <Segment
    color='violet'
    style={{
      ...sideSegmentStyle,
      flex: 1,
      margin: 0,
      overflow: 'auto',
      minHeight: 0,
      justifyContent: 'space-between',
      display: 'flex',
      flexDirection: 'column'
    }}
  >
    <div>
      {props.children}
    </div>
    <div>
      {props.negativePanel}
    </div>
  </Segment>
  : null

const ContextActionPanel = props =>
  props.children
    ? <Segment
      style={sideSegmentStyle}>
        {props.children}
      </Segment>
    : null

const ActionSidebar = props => {
  const {
    addUserButton,
    contextPanel,
    layout,
    negativePanel,
    onClickUser,
    pagePanel,
    panelContent,
    setUserPanelVisible
  } = props

  const isEmpty = !(panelContent || pagePanel || negativePanel || contextPanel)

  return (
    <Segment
      className={`actionsidebar ${layout || ''} ${isEmpty ? 'empty' : ''}`}
    >
      { addUserButton
        ? <SiteActionPanel
          onClickUser={onClickUser}
          setUserPanelVisible={setUserPanelVisible}
        />
        : null
      }      
      <PageActionPanel
        negativePanel={negativePanel}
      >
        { panelContent }
        { pagePanel }
      </PageActionPanel>
      <ContextActionPanel>
        { contextPanel }
      </ContextActionPanel>  
    </Segment>
  )
}

export default ActionSidebar
