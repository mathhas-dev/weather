import React from 'react'
import { Button, Form, Grid, Header, Message } from 'semantic-ui-react'
import { useHistory } from "react-router-dom"
import { useTranslation } from "react-i18next";

const LogoutContent = () => {
  const history = useHistory();
  const { t } = useTranslation();

  const goToLoginPage = () => {
    history.push("/user/login");
  };

  return (
    <Grid textAlign='center' style={{ height: '80vh' }} verticalAlign='middle'>
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as='h2' color='teal' textAlign='center'>
          {t("Thank you for using our services!")}
        </Header>
        <Button color='teal' fluid size='large'
          onClick={goToLoginPage}
        >
          Login
        </Button>
      </Grid.Column>
    </Grid>
  )
};


export default LogoutContent
