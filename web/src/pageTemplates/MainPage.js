import React, { useState, useEffect } from 'react'
import MenuSidebar from 'components/MenuSidebar'
import ActionSidebar from 'components/ActionSidebar'
import { observer } from 'mobx-react'
import './MainPage.less'
import { Button, Container, Icon, Image, Sidebar } from 'semantic-ui-react'
import { UserPanel } from 'modules/User/components'
import designStore from '../stores/designStore'
import logoImage from 'assets/logo.png'
import useIsMounted from 'ismounted'

const MainPage = observer(props => {
  const { children, contextPanel, pagePanel, negativePanel } = props

  const width = designStore.screenSize.x
  const layout = width < 700
    ? 'mobile'
    : width < 1200
      ? 'tablet'
      : 'desktop'

  return (
    <Sidebar.Pushable style={{ overflow: 'unset' }}>
      <div className='main-page'>
        <Menu layout={layout}/>
        <ConteudoDaPagina>
          {children}
        </ConteudoDaPagina>
        <PainelAcoes
          layout={layout}
          panels={{
            context: contextPanel,
            page: pagePanel,
            negative: negativePanel
          }}
        />
      </div>
    </Sidebar.Pushable>
  )
})

const SideButton = props => {
  const { isPanelEmpty, layout, showMenu, toggle, type } = props

  const className = `side-${type}-${layout}-button`
  const color = type === 'nav' ? 'blue' : 'violet'

  const BarIcon = () =>
    type === 'nav'
      ? <Image
        className='small-logo'
        src={logoImage}
      />
      : <Icon
        color='blue'
        size='large'
        name='content'
        style={{
          padding: 0
        }}
      />
  
  const EmptyButton = () =>
    <div style={{ width: '100%', height: '100%', background: 'var(--violet)' }} />

  if (isPanelEmpty) return <EmptyButton />

  return (
    <Button
      className={className}
      color={color}
      onClick={toggle}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <BarIcon />
        
        { type === 'nav' && layout === 'mobile'
          ? <span style={{ fontSize: '1.6em', marginLeft: 8 }}>Base</span>
          : null
        }
      </div>
      <Icon
        name={`${showMenu ? 'minus' : 'plus'} square outline`}
        color='grey'
        size='large'
        style={{ margin: '8px 0' }}
      />
    </Button>
  )  
}

const UserButton = props => {
  const { toggle } = props

  return (
    <Button
      className='main-page__user-button'
      color='yellow'
      onClick={toggle}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Icon
          color='blue'
          name='circle user outline'
          size='large'
          style={{ margin: 0 }}
        />
      </div>
    </Button>
  )
}

const SideCanvas = props => {
  const { layout, panels, type, visible } = props
  const [open, setOpen] = useState(false)
  const [exists, setExists] = useState(false)
  const [blockInput, setBlockInput] = useState(false)
  const isMounted = useIsMounted()
  
  useEffect(() => {
    if (visible) {
      if (!blockInput) {
        setExists(true)
        setTimeout(() => {
          if (isMounted.current) setOpen(true)
        }, 50)
      }
    } else {
      setBlockInput(true)
      setOpen(false)
      setTimeout(() => {
        if (isMounted.current) {
          setExists(false)
          setBlockInput(false)
        }
      }, 600)
    }
  }, [visible]) // eslint-disable-line react-hooks/exhaustive-deps 

  if (!exists) return null

  const typeAlias = { nav: 'menu', action: 'panel', user: 'user'}[type]
  const className = `${typeAlias}-${layout}-canvas`

  const direction = {
    nav_mobile: 'top',
    nav_tablet: 'left',
    action_mobile: 'bottom',
    action_tablet: 'right',
    user_mobile: 'top',
    user_tablet: 'right',
    user_desktop: 'right'
  }[`${type}_${layout}`]

  return (
    <Sidebar.Pushable
      as='aside'
      className={className+' 222'}
    >
      <Sidebar
        animation='overlay'
        direction={direction}
        visible={open}
        className='111'
      >
        { type === 'nav'
          ? <MenuSidebar
            layout={layout}
          />
          : null
        }
        { type === 'action'
          ? <ActionSidebar
            layout={layout}
            contextPanel={panels.context}
            negativePanel={panels.negative}
            pagePanel={panels.page}
          />
          : null
        }
        { type === 'user'
          ? <UserPanel layout={layout}/>
          : null        
        }
      </Sidebar>
    </Sidebar.Pushable>
  )
}

const Menu = props => {
  const { layout } = props
  const [showMenu, setShowMenu] = useState(false)
  const [panelType, setPanelType] = useState('menu')

  const toggleShowMenu = typeCaller => {
    if (showMenu && typeCaller !== panelType) {
      setPanelType(typeCaller)
    } else {
      setPanelType(typeCaller)
      setShowMenu(!showMenu)
    }
  }

  return (
    <div className={`menu-sidebar-wrapper ${layout}`}>
      { layout === 'mobile'
        ? <>
          <SideButton
            type='nav'
            layout={layout}
            toggle={() => toggleShowMenu('nav')}
            showMenu={showMenu}
          />
          <UserButton toggle={() => toggleShowMenu('user')} />
          <SideCanvas type={panelType} layout={layout} visible={showMenu}/>
        </>
        : null
      }
      { layout === 'tablet'
        ? <>
          <SideButton type='nav' layout={layout} toggle={toggleShowMenu} showMenu={showMenu}/>
          <SideCanvas type='nav' layout={layout} visible={showMenu}/>
        </>
        : null      
      }
      { layout === 'desktop'
        ? <MenuSidebar layout={layout} />
        : null
      }
    </div>
  )
}

const ConteudoDaPagina = props =>
  <Sidebar.Pushable
    as='section'
    className='main-page-content'
  >
    <Container fluid>
      {props.children}
    </Container>
  </Sidebar.Pushable>

const PainelAcoes = props=> {
  const { layout, panels } = props
  const [showPanel, setShowPanel] = useState(false)
  const [panelType, setPanelType] = useState('action')

  const toggleShowPanel = typeCaller => {
    if (showPanel && typeCaller !== panelType) {
      setPanelType(typeCaller)
    } else {
      setPanelType(typeCaller)
      setShowPanel(!showPanel)
    }
  }

  const isPanelEmpty = !(panels.page || panels.negative || panels.context)

  return (
    <section className={`panel-sidebar-wrapper ${layout}`}>
      { (layout === 'mobile') || (layout === 'tablet')
        ? <>
          { layout === 'tablet'
            ? <UserButton
              toggle={() => toggleShowPanel('user')}
            />
            : null
          }
          <SideButton
            type='action'
            layout={layout}
            toggle={() => toggleShowPanel('action')}
            showMenu={showPanel}
            isPanelEmpty={isPanelEmpty}
          />
          <SideCanvas
            type={panelType}
            layout={layout}
            visible={showPanel}
            panels={panels}
          />
        </>
        : <>
          <ActionSidebar
            addUserButton
            layout={layout}
            contextPanel={panels.context}
            negativePanel={panels.negative}
            pagePanel={panels.page}
            onClickUser={() => toggleShowPanel('user')}
          />
          <SideCanvas
            type={panelType}
            layout={layout}
            visible={showPanel}
          />
        </>
      }
    </section>
  )
}

export default MainPage
