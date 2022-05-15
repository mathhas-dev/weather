import React, { Suspense } from 'react'
// import 'semantic-ui-css/semantic.min.css'
import { BrowserRouter } from 'react-router-dom'
import { Loader } from 'semantic-ui-react'
import Routes from 'Routes'
import 'semantic-ui-less/semantic.less'

const App = (props) => {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <Loader size='small' active inline>
            Carregando
          </Loader>
        }
      >
        <Routes />
      </Suspense>
    </BrowserRouter>
  )
}


export default App;


