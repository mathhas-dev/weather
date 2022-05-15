import * as pages from './pages'
import Page404 from 'components/Page404.js'
import i18n from "i18next";

function Modulo () {
  this.name = 'template'
  this.title = 'Template Title'
  this.routes= [
    {
      path: `/`,
      exact: true,
      title: i18n.t("Home page"),
      hidden: true,
      public: false,
      component: pages.HomePage
    },
  
    {
      path: `/${this.name}`,
      title: 'Página não encontrada',
      hidden: true,
      public: true,
      component: Page404
    }
  ]
}

export default new Modulo()