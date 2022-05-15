import * as pages from './pages'
import Page404 from 'components/Page404.js'

function Modulo () {
  this.name = 'template'
  this.title = 'Template Title'
  this.routes= [
    {
      path: `/${this.name}`,
      exact: true,
      title: 'Página de exemplo',
      component: pages.PaginaExemplo
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