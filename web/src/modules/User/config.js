import * as pages from './pages'
import Page404 from 'components/Page404.js'
import PageLogout from 'components/PageLogout';
import i18n from "i18next";

function Modulo() {
  this.name = ''
  this.title = i18n.t("User")
  this.management = true
  this.routes = [
    {
      path: `/user/login`,
      exact: true,
      title: i18n.t("Login"),
      public: true,
      hidden: true,
      component: pages.Login
    },
    {
      path: `/user/login/sms`,
      exact: true,
      title: i18n.t("Login"),
      public: true,
      hidden: true,
      component: pages.LoginSMS
    },
    {
      path: `/user/change_password/:token`,
      exact: true,
      title: i18n.t("Change Password"),
      public: true,
      hidden: true,
      component: pages.ChangePassword
    },
    {
      path: `/user`,
      exact: true,
      title: i18n.t("Users"),
      only_manager: true,
      component: pages.ListUser
    },
    {
      path: `/user/:id(\\d+)`,
      exact: true,
      title: i18n.t("Edit user"),
      hidden: true,
      component: pages.EditUser
    },
    {
      path: `/user/:id(\\d+)/unlock`,
      exact: true,
      title: i18n.t("Unlock User"),
      hidden: true,
      component: pages.UnlockUser
    },
    {
      path: `/user/create`,
      exact: true,
      title: i18n.t("New User"),
      hidden: true,
      component: pages.EditUser
    },
    {
      path: `/user/logout`,
      title: 'Logout',
      public: true,
      hidden: true,
      component: PageLogout
    },
    {
      path: `/`,
      title: '404',
      public: false,
      hidden: true,
      component: Page404
    }
  ]
}

export default new Modulo()
