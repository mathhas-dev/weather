import React from 'react'
import MenuSidebar from 'components/MenuSidebar'
import ActionSidebar from 'components/ActionSidebar'
import { Grid } from 'semantic-ui-react'
import { observer } from 'mobx-react'
import { designStore } from 'stores'
import { testingStore } from 'modulos/testing/stores'

// import './MainPage.less'

const JobShow = observer(props => {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        background: 'lightgreen',
        left: 0,
        right: 0,
        margin: '42px auto',
        maxWidth: 'fit-content',
        padding: '24px 42px',
        borderRadius: 12,
        textAlign: 'center'
      }}
    >
      { testingStore.count.map((item, idx) => {
        const [nome, valor] = item
        return (
            <div key={idx}>{nome}: {valor}</div>
        )
      })}
    </div>
  )
})

const MainPage = observer(props => {
  const { contextPanel, pagePanel } = props
  // const width = designStore.screenSize.x || 1000
  const emptyRightPanel = !(contextPanel || pagePanel)

  return (
    <div className='main-page'>
      <section className='panel-menu'>
        <MenuSidebar />
      </section>
      <section className='content'>
        {props.children}
      </section>
      <section
        className={`panel-actions ${emptyRightPanel ? 'empty' : ''}`}
      >
        <ActionSidebar
          contextPanel={contextPanel}
          pagePanel={pagePanel}
        />
      </section>
      <JobShow />
    </div>
  )
})

export default MainPage
