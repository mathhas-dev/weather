import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { observer } from 'mobx-react'
import { userStore, userDomain } from '../stores'
import {
  Header, Button, Form, Message, List, Icon, Dropdown
} from 'semantic-ui-react'
import Page from 'pageTemplates/MainPage'
import { to_option } from 'utils'

import { useTranslation } from "react-i18next";

const country_codes = [
  { key: 1, value: 1, flag: 'us', text: '(+1) United States' },
  { key: 52, value: 52, flag: 'mx', text: '(+52) Mexico' },
  { key: 55, value: 55, flag: 'br', text: '(+55) Brasil' },
]

const MainProfileSelect = observer(() => {
  const { dados } = userStore;
  const options = to_option(userDomain.profiles);
  const { t } = useTranslation();

  const selectProfile = (event, { value }) => {
    dados.profile = value;
  };

  return (
    <>
      <Form.Select label={t("Main Profile")}
        selection
        placeholder={t("Select profile")}
        options={options}
        required
        error={userStore.getError('profile')}
        value={dados.profile}
        onChange={selectProfile}
      />
    </>
  );
});

const ProfilesSelect = observer(() => {
  const { dados } = userStore;
  const options = to_option(userDomain.profiles);
  const { t } = useTranslation();

  const handleChangeSelect = (event, { value }) => {
    dados.profiles = value
  };

  return (
    <>
      <Form.Select label={t("Profiles")}
        placeholder={t("Select profile")}
        options={options}
        error={userStore.getError('profiles')}
        value={dados.profiles.length > 0 ? dados.profiles : null}
        onChange={handleChangeSelect}
        selection
        required
        multiple
      />
    </>
  );
});

const CellNumber = observer(() => {
  const { dados } = userStore;
  const { t } = useTranslation();

  const handleChangeSelect = (event, { value }) => {
    dados.country_code_number = value
  };

  const handleChangeInputText = prop => (event) => {
    dados[prop] = event.target.value;
  };

  return (
    <>
      <Form>
        <Form.Group>
          <Form.Select
            width={4}
            label={t("Contry Code")}
            placeholder={t("Select country code")}
            options={country_codes}
            error={userStore.getError('country_code_number')}
            value={dados.country_code_number !== '' ? dados.country_code_number : null}
            onChange={handleChangeSelect}
            selection
            clearable
            search
          />
          <Form.Input
            width={12}
            label={t("Phone")}
            placeholder={t("Phone")}
            error={userStore.getError('phone')}
            value={dados.phone}
            onChange={handleChangeInputText('phone')}
          />
        </Form.Group>
      </Form>
    </>
  );
});

const FormUser = observer(() => {
  const { dados } = userStore;
  const handleChangeInputText = prop => (event) => {
    dados[prop] = event.target.value;
  };
  const { t } = useTranslation();

  return (
    <Form>
      <Form.Input
        label={t("Username")}
        placeholder={t("Username")}
        value={dados.username}
        width={6}
        loading={userStore.searching}
        disabled
      />
      <Form.Input
        label={t("Name")}
        placeholder={t("Name")}
        error={userStore.getError('name')}
        value={dados.name}
        onChange={handleChangeInputText('name')} />
      <Form.Input
        required
        label={t("E-mail")}
        placeholder={t("E-mail")}
        error={userStore.getError('email')}
        value={dados.email}
        onChange={handleChangeInputText('email')} />
      <CellNumber />
      <MainProfileSelect />
      <ProfilesSelect />
    </Form>
  )
});

const PageButtons = observer(() => {
  const history = useHistory();
  const handleSave = () => {
    userStore.save();
    setTimeout(() => {
      history.push('/user')
    }, 2500);
  };

  const handleBack = () => {
    history.goBack();
  };

  const { t } = useTranslation();

  return (
    <List>
      <List.Item>
        <Button onClick={handleSave} fluid loading={userStore.saving} primary>
          <Icon name='save' /> {t("Save")}
        </Button>
      </List.Item>
      <List.Item>
        <Button onClick={handleBack} fluid>
          <Icon name='arrow left' /> {t("Back")}
        </Button>
      </List.Item>
    </List>
  );
});

const EditUser = observer((props) => {
  const { match: { params: { id } } } = props;
  const { dados: { profile } } = userStore

  useEffect(() => {
    userStore.reset();
    userDomain.search_managed_profiles(id);
  }, [id]);

  useEffect(() => {
    if (id) userStore.id = id
  }, [id]);

  const { t } = useTranslation();

  const title = id ? t("Edit user") : t("Register user");

  return (
    <Page pagePanel={<PageButtons />}>
      <Header as='h1'>{title}</Header>
      <Message
        hidden={userStore.message === null}
        {...userStore.message}
      />
      <FormUser />
    </Page>
  )
});

export default EditUser
