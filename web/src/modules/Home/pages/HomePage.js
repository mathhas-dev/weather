import React, { useEffect } from 'react'
import Page from 'pageTemplates/Comum'
import { Header, Icon, Message } from 'semantic-ui-react'
import { useTranslation } from "react-i18next";
import "../../../locales/i18n";
import SelectLanguage from '../../../locales/component'
import { userStore } from 'stores';
import { observer } from 'mobx-react';
import { Weather } from 'modules/Weather/pages';

const SuperTitle = props => {
  const { layout, title } = props

  const desktop = layout === 'desktop'
  const tablet = layout === 'tablet'

  const wrapperStyle = {
    marginBottom: desktop ? '2em' : '1em',
    marginTop: desktop ? '8em' : tablet ? '3em' : '1em',
  }

  const titleStyle = {
    fontWeight: 300,
    fontHeight: desktop ? '4rem' : tablet ? '3rem' : '2rem'
  }

  return (
    <div
      style={wrapperStyle}
    >
      <Header
        as='h1'
        style={titleStyle}
      >{title}</Header>
    </div>
  )
}

const HomePage = observer(props => {
  const { t } = useTranslation();

  useEffect(() => {
    userStore.get_401_or_403();
  }, [])

  const dismissMessage = () => {
    userStore.message = null;
    userStore.remove_401_or_403();
  }

  return (
    <Page suppressBreadcrumb>

      <div style={{ float: 'right' }}>
        <Icon name='star' />
        {t("Made by")} Matheus Henrique 
        <Icon name='star' />
      </div>

      <SelectLanguage />

      <Message
        hidden={userStore.message === null}
        onDismiss={dismissMessage}
        {...userStore.message}
      />

      <SuperTitle title={t("Welcome to Voltalia Weather Site!")} />

      <Weather />

    </Page>
  )
})

export default HomePage