import React, { useState } from 'react'
import { Button, Header, Segment, Form } from 'semantic-ui-react'
import { Link, useHistory } from 'react-router-dom'
import { userStore } from '../../../stores';
import './UserPanel.less'
import { observer } from 'mobx-react';
import { to_option } from 'utils';

import { useTranslation } from "react-i18next";

const UserPanel = props => {
  const { layout } = props
  const { logged } = userStore

  return logged
    ? <LoggedPanel layout={layout} />
    : <NotLoggedPanel layout={layout} />
}

const UserSegment = props => {
  const { layout } = props
  return (
    <Segment
      className={`usersidebar ${layout}`}
      style={{
        minHeight:
          layout === 'mobile' ? null
            : layout === 'tablet' ? '100vh'
              : layout === 'desktop' ? 'calc(100vh - 132px)'
                : null
      }}
    >
      {props.children}
    </Segment>
  )
}

const CurrentProfileSelect = observer(() => {
  const { profile_id, profiles } = userStore.profile;
  const { t } = useTranslation();
  const options = to_option(profiles);

  const selectProfile = (event, { value }) => {
    userStore.profile.profile_id = value;
    userStore.updateActiveProfile();
  };

  return (
    <>
      <Form.Select
        label={t("Current Profile")}
        selection
        placeholder={t("Select profile")}
        options={options}
        required
        error={userStore.getError('profile')}
        value={profile_id}
        onChange={selectProfile}
      />
    </>
  );
});

const LoggedPanel = observer(props => {
  const { layout } = props
  const history = useHistory()
  const [show_change_active_profile, setShowChangeCurrentProfile] = useState(false)

  const { t } = useTranslation();

  const logout = () => {
    userStore.logout()
  }

  return (
    <UserSegment layout={layout}>
      <aside className='wrapper'>
        <Header as='h1' size='small'>{userStore.profile.nome}</Header>
        {
          show_change_active_profile ?
            <CurrentProfileSelect />
            :
            <p>{userStore.profile.profile}</p>
        }
        <Button color='blue' onClick={() => setShowChangeCurrentProfile(!show_change_active_profile)}>{t("Change Profile")}</Button>
        <Button color='red' onClick={logout}>{t("Log off")}</Button>
      </aside>
    </UserSegment>
  )
})

const NotLoggedPanel = props => {
  const { t } = useTranslation();
  const { layout } = props
  return (
    <UserSegment layout={layout}>
      <Link to={'/user/login'}>{t("Login")}</Link>
    </UserSegment>
  )
}

export default UserPanel