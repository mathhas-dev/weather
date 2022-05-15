import React, { useState, useEffect } from 'react'
import { observer } from 'mobx-react'
import { useHistory } from 'react-router-dom'
import { users } from '../stores'
import {
  Table, Pagination, Loader, Button, Confirm, Message, Icon,
} from 'semantic-ui-react'
import { Header } from 'semantic-ui-react'
import Page from 'pageTemplates/MainPage'

import { useTranslation } from "react-i18next";
import i18n from "i18next";

const NewButton = props => {
  const history = useHistory();
  const { t } = useTranslation();

  const handleClick = () => {
    history.push(`/user/create`);
  };
  return (
    <Button as='a' onClick={handleClick} color='blue' fluid>
      <Icon name='plus' /> {t("New")}
    </Button>
  );
};

const EditButton = props => {
  const { id } = props;
  const history = useHistory();
  const handleClick = () => {
    history.push(`/user/${id}`);
  };
  return (
    <Button as='a' icon='edit' onClick={handleClick} color='teal' />
  );
};

const RemoveButton = props => {
  const [openConfirm, setOpenConfirm] = useState(false);
  const { user } = props;
  const confirmRemove = () => {
    users.remove(user.id);
  };

  const { t } = useTranslation();

  return (
    <>
      <Confirm
        open={openConfirm}
        onCancel={() => setOpenConfirm(false)}
        onConfirm={confirmRemove}
        confirmButton={t("Remove")}
        cancelButton={t("Back")}
        content={i18n.t("Confirm User Removal ") + user.username + "?"}
      />
      <Button as='a'
        onClick={() => setOpenConfirm(true)}
        loading={users.removing}
        color='red'
        icon='trash'
      />
    </>
  );
};

const BlockButton = props => {
  const [openConfirm, setOpenConfirm] = useState(false);
  const { user } = props;
  const confirmAction = () => {
    users.block(user.id);
  };

  const { t } = useTranslation();

  return (
    <>
      <Confirm
        open={openConfirm}
        onCancel={() => setOpenConfirm(false)}
        onConfirm={confirmAction}
        confirmButton={t("Block")}
        cancelButton={t("Back")}
        content={i18n.t("Block user ") + user.username + "?"}
      />
      <Button as='a'
        onClick={() => setOpenConfirm(true)}
        loading={users.blocking}
        color='brown'
        icon='lock'
      />
    </>
  );
};

const UnlockButton = ({ id }) => {
  const history = useHistory();
  const handleClick = () => {
    history.push(`/user/${id}/unlock`);
  };
  return (
    <Button as='a'
      color='yellow' icon='lock open'
      onClick={handleClick} />
  );
};

const RowButtons = props => {
  const { user } = props;
  const { id, blocked } = user;
  return (
    <>
      {
        users.can_update ?
          <EditButton id={id} />
          :
          null
      }
      {
        users.can_destroy ?
          <RemoveButton user={user} />
          :
          null
      }
      {
        blocked ?
          <UnlockButton id={id} /> :
          <BlockButton user={user} />
      }
    </>
  );
};

const PageButtons = props => {
  return (
    <>
      <NewButton />
    </>
  );
};

const RowUser = props => {
  const { user } = props;
  // const popupContent =
  //   user.motivos_block.length === 0 ? null :
  //     user.motivos_block.length === 1 ?
  //       user.motivos_block[0] :
  //       (
  //         <List bulleted>
  //           { user.motivos_block.map((motivo) =>
  //             <List.Item>{motivo}</List.Item>)
  //           }
  //         </List>
  //       );

  return (
    <Table.Row>
      <Table.Cell>{user.id}</Table.Cell>
      <Table.Cell>{user.name}</Table.Cell>
      <Table.Cell>{user.profile}</Table.Cell>
      <Table.Cell>
        {user.blocked ?
          // <Popup content={popupContent}
          //   trigger={<span>Sim</span>}
          // />
          "Sim"
          : "Não"
        }
      </Table.Cell>
      <Table.Cell>
        <RowButtons user={user} />
      </Table.Cell>
    </Table.Row>
  );
};

const ListUser = observer((props) => {
  const loading = users.loading;
  const pagination = users.pagination;

  useEffect(() => {
    users.page = 1
  }, []);

  const list = users.list

  const { t } = useTranslation();

  return (
    <Page
      pagePanel={<PageButtons />}>
      <Header as='h1'>{t("Users")}</Header>
      <Message
        hidden={users.message === null}
        {...users.message}
      />
      <Table striped={true}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>{t("ID")}</Table.HeaderCell>
            <Table.HeaderCell>{t("Name")}</Table.HeaderCell>
            <Table.HeaderCell>{t("Profile")}</Table.HeaderCell>
            <Table.HeaderCell>{t("Blocked")}</Table.HeaderCell>
            <Table.HeaderCell>{t("Action")}</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {
            loading
              ?
              <Table.Row><Table.Cell>
                <Loader active={loading} />
              </Table.Cell></Table.Row>
              :
              users.list.length === 0
                ? <Table.Row><Table.Cell>Nenhuma info</Table.Cell></Table.Row>
                : list.map(item => <RowUser user={item} key={item.id} />)
          }
        </Table.Body>
      </Table>
      <Pagination {...pagination} />
    </Page>
  )
});

export default ListUser
