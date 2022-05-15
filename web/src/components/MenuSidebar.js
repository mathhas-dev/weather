import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Button, Header, Icon, Image, Menu, Segment } from 'semantic-ui-react'
import logoImage from 'assets/logo.png'
import { Revealer } from 'components'
import modulesConfig from 'stores/modules'
import './MenuSidebar.less'
import { userStore } from 'stores'
import { observer } from 'mobx-react'
import { useTranslation } from "react-i18next";

const LinkButton = props => {
  const { children, onClick, to } = props
  const history = useHistory()
  const linkTo = onClick
    ? onClick
    : to
      ? () => history.push(to)
      : () => { }

  return (
    <Button
      onClick={linkTo}
      style={{
        background: 'transparent',
        color: 'white',
        display: 'block',
        opacity: 0.7,
        padding: 0,
        textAlign: 'left',
        width: '100%'
      }}
    >
      {children}
    </Button>
  )
}

const MenuItemModule = props => {
  const { modulo, paginas } = props
  const [panelOpen, setPanelOpen] = useState(false)
  const togglePanel = () => setPanelOpen(!panelOpen)

  return (
    <>
      {
        paginas.length > 0
          ?
          <Menu.Item>
            <LinkButton
              onClick={togglePanel}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between'
                }}
              >
                {modulo}
                <Icon
                  name={panelOpen ? 'minus' : 'plus'}
                  size='small'
                  color='grey'
                  style={{ marginTop: 4 }}
                />
              </div>
            </LinkButton>
            <Revealer
              inverted
              backgroundColor={'hsla(0, 0%, 100%, 0.07)'}
              style={{ transition: 'all 0.5s' }}
              styleOpen={{ marginBottom: 0, marginTop: 12 }}
              buttonColor='blue'
              open={panelOpen}
            >
              {paginas.map((label, idx) =>
                <Menu.Menu key={idx} color='blue'>
                  <Menu.Item
                  >
                    {label}
                  </Menu.Item>
                </Menu.Menu>
              )}
            </Revealer>
          </Menu.Item>
          :
          null
      }
    </>
  )
}

const Identity = props => {
  const { layout } = props

  return (
    <section className={`identity-container ${layout}`}>
      <Link to='/'>
        <Image
          className='big-logo'
          centered
          src={logoImage}
          size='massive'
        />
      </Link>
      <div className='title-logo'></div>
      <div style={{ margin: '24px 0', opacity: 0.5 }}>
        <Header
          as='h1'
          inverted
          size='small'
          textAlign='center'
          color='grey'
        >
          Voltalia
        </Header>
        <Header
          sub
          inverted
          size='small'
          textAlign='center'
          color='grey'
          style={{ marginTop: -8 }}
        >
          version {process.env.REACT_APP_VERSION}
        </Header>
      </div>
    </section>
  )
}

const ItemsMenu = props => {
  const { t } = useTranslation();
  const { modulosVisiveis, management } = props

  return (
    <>
      <Header
        as='h1'
        inverted
        size='small'
        textAlign='center'
        color='grey'
      >
        {management ? t("Management") : t("User")}
      </Header>
      <Menu fluid vertical inverted color='blue'>
        {modulosVisiveis
          .map(entry =>
            entry[1].management === management ?
              (
                <MenuItemModule
                  key={entry[0]}
                  modulo={entry[1].title || entry[1].name}
                  paginas={entry[1].routes
                    .filter(item => !item.hidden)
                    .filter(item =>
                      item.only_manager
                        ?
                        userStore.profile.profile === process.env.REACT_APP_MANAGEMENT_PROFILE || userStore.profile.profile === process.env.REACT_APP_ADMIN_PROFILE
                          ?
                          item
                          :
                          null
                        :
                        item)
                    .map(item =>
                      <LinkButton to={item.path}>{item.title}</LinkButton>
                    )
                  }
                />
              )
              :
              null
          )
        }
      </Menu>
    </>
  )
}


const MenuSidebar = observer(
  props => {
    const { layout, style } = props
    const { modulos } = modulesConfig
    const modulosVisiveis = Object.entries(modulos)
      .filter(([nome, modulo]) => modulo && !modulo.hidden)

    return (<>
      <Segment
        className={`menusidebar ${layout}`}
        color='blue'
        inverted
        style={{ ...style }}
      >
        <Identity layout={layout} />

        {userStore.profile.profile === process.env.REACT_APP_USER_PROFILE ?
          <ItemsMenu modulosVisiveis={modulosVisiveis} />
          :
          <ItemsMenu modulosVisiveis={modulosVisiveis} management />}

      </Segment>
    </>)
  }
)


export default MenuSidebar