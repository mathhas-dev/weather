import React from 'react'
import { Route, Switch, useLocation } from 'react-router-dom'
import { useRestrito } from 'utils'
import { Redirect } from 'react-router-dom'
import { userStore } from 'stores'

const User = React.lazy(() => import('modules/User'))
const Home = React.lazy(() => import('modules/Home'))

const Routes = props => {
  const forceLogin = useRestrito()
  const location = useLocation();

  if (forceLogin) {
    userStore.redirect_after_login = location.pathname;
    return <Redirect to='/user/login' />
  }

  return (
    <Switch>

      <Route
        path='/user'
        component={User}
      />

      <Route
        path='/'
        component={Home}
      />

    </Switch>
  )
}

export default Routes
