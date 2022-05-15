import React, { useState, useEffect, useRef } from 'react'
import MenuSidebar from 'components/MenuSidebar'
import ActionSidebar from 'components/ActionSidebar'
import {
  Overlay,
  UserLoginButton,
} from 'components'
import { observer } from 'mobx-react'
import './Comum.less'
import { Breadcrumb, Button, Container, Icon, Image, Sidebar } from 'semantic-ui-react'
import { UserPanel } from 'modules/User/components'
import designStore from '../stores/designStore'
import logoImage from 'assets/logo.png'
import useIsMounted from 'ismounted'
import { getPageConfig } from 'utils'
import { Link } from 'react-router-dom'

const Comum = observer(props => {
  const {
    buttons,
    children,
    panelContent,
    panelIcon,
    panelTitle,
    suppressBreadcrumb
  } = props

  const width = designStore.screenSize.x
  const layout = width < 700
    ? 'mobile'
    : width < 1200
      ? 'tablet'
      : 'desktop'
  
  const buttonOffset = layout === 'mobile'
    ? panelContent
      ? 'double-offset'
      : 'single-offset'
    : 'no-offset'

  return (
    <Sidebar.Pushable style={{ overflow: 'unset' }}>
      <div className={`comum-page ${layout} ${buttonOffset}`}>
        <Menu layout={layout}/>
        <ConteudoDaPagina
          buttons={buttons}
          buttonOffset={buttonOffset}
          layout={layout}
          suppressBreadcrumb={suppressBreadcrumb}
        >
          {children}
        </ConteudoDaPagina>
        <PainelLateral
          layout={layout}
          panelContent={panelContent}
          panelIcon={panelIcon}
          panelTitle={panelTitle}
        />
      </div>
    </Sidebar.Pushable>
  )
})

const SideButton = props => {
  const {
    isPanelEmpty,
    layout,
    panelIcon,
    panelTitle,
    showMenu,
    toggle,
    type
  } = props

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
        name={panelIcon || 'content'}
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
        { layout === 'mobile'
          ? type === 'nav'
            ? <span style={{ fontSize: '1.6em', marginLeft: 8 }}>Base</span>
            : panelTitle
              ? <span style={{ color: 'var(--blue)' }}>{panelTitle}</span>
              : null
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

// const UserButton = props => {
//   const { toggle } = props

//   return (
//     <Button
//       className='main-page__user-button'
//       color='yellow'
//       onClick={toggle}
//     >
//       <div
//         style={{
//           display: 'flex',
//           alignItems: 'center'
//         }}
//       >
//         <Icon
//           // color='blue'
//           color='blue'
//           name='circle user outline'
//           size='large'
//           style={{ margin: 0 }}
//         />
//       </div>
//     </Button>
//   )
// }

const SideCanvas = props => {
  const {
    layout,
    panelContent,
    type,
    visible
  } = props

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
            panelContent={panelContent}
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
      <Overlay
        active={showMenu}
        onClick={() => setShowMenu(false)}
      />
      { layout === 'mobile'
        ? <>
          <SideButton
            type='nav'
            layout={layout}
            toggle={() => toggleShowMenu('nav')}
            showMenu={showMenu}
          />
          {/* <UserButton toggle={() => toggleShowMenu('user')} /> */}
          <UserLoginButton
            onClick={() => toggleShowMenu('user')}
          />
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

const BreadcrumbComum = props => {
  const pageConfig = getPageConfig(window.location.pathname)
  // const { parent, title } = pageConfig

  // console.log('pageConfig', pageConfig)

  const getParentConfig = (config, arr=[]) => {
    if (config.parent) {
      const parentConfig = getPageConfig(config.parent)
      return getParentConfig(parentConfig, [config, ...arr])
    }
    return [config, ...arr]
  }

  const paths = getParentConfig(pageConfig)
  const currentPage = paths.pop()

  return (
    <Breadcrumb
      style={{ marginTop: '-2em', marginBottom: '1em' }}
    >
      { paths.reduce((acc, config, idx) => {
          return [
            ...acc,
            <Breadcrumb.Section
              as={Link}
              to={config.path}
              link
              key={config.path}
            >
              {config.title}
            </Breadcrumb.Section>,
            <Breadcrumb.Divider key={idx}>
              >
            </Breadcrumb.Divider>
          ]
        }, [])
      }
      <Breadcrumb.Section active>{currentPage.title}</Breadcrumb.Section>
    </Breadcrumb>
  )
}

const isReactComponent = component =>
  React.isValidElement(component) &&
  typeof component.type !== 'string'
  
const ConteudoDaPagina = observer(props => {
  const { buttonOffset, buttons, children, layout, suppressBreadcrumb } = props
  const [innerWidth, setInnerWidth] = useState(0)

  const pageWidth = designStore.screenSize.x
  
  const contentWrapper = useRef()
  useEffect(() => {
    setInnerWidth(contentWrapper.current.clientWidth)
  }, [pageWidth])

  const clonedChildren = React.Children.map(children, child =>
    isReactComponent(child)
      ? React.cloneElement(child, { 'data-inner-width': innerWidth, layout })
      : child
  )

  return (
    <Sidebar.Pushable
      as='section'
      className={`common-page__content-wrapper ${buttonOffset}`}
    >
      <div className='common-page__content' ref={contentWrapper}>
        { suppressBreadcrumb
          ? null
          : <BreadcrumbComum />
        }
        <Container fluid>
          {clonedChildren}
        </Container>
      </div>
      { props.buttons
        ? <div className='common-page__button-footer'>
          <div>
            {buttons}
          </div>
        </div>
        : null
      }    
    </Sidebar.Pushable>
  )
})

const PainelLateral = props=> {
  const { layout, panelContent, panelIcon, panelTitle } = props

  const [showPanel, setShowPanel] = useState(false)
  const [panelType, setPanelType] = useState('action')

  const ref = useRef()

  const toggleShowPanel = typeCaller => {
    if (showPanel && typeCaller !== panelType) {
      setPanelType(typeCaller)
    } else {
      setPanelType(typeCaller)
      setShowPanel(!showPanel)
    }
  }

  const isPanelEmpty = !panelContent
  
  return (
    <section
      className={`panel-sidebar-wrapper ${layout}`}
      ref={ref}
    >
      <Overlay
        active={showPanel}
        onClick={() => setShowPanel(false)}
      />
      { (layout === 'mobile') || (layout === 'tablet')
        ? <>
          { layout === 'tablet'
            // ? <UserButton
            //   toggle={() => toggleShowPanel('user')}
            // />
            ? <UserLoginButton
              onClick={() => toggleShowPanel('user')}
            />
            : null
          }
          <SideButton
            type='action'
            layout={layout}
            toggle={() => toggleShowPanel('action')}
            showMenu={showPanel}
            isPanelEmpty={isPanelEmpty}
            panelIcon={panelIcon}
            panelTitle={panelTitle}
          />
          <SideCanvas
            type={panelType}
            layout={layout}
            visible={showPanel}
            panelContent={panelContent}
          />
        </>
        : <>
          <ActionSidebar
            addUserButton
            layout={layout}
            panelContent={panelContent}
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


export default Comum
