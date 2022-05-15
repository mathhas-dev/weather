import React, { Suspense } from 'react';
import ReactDOM from 'react-dom'
import './index.less'
import App from './App'
import * as serviceWorker from './serviceWorker'
import 'mobx-react-lite/batchingForReactDom'
// import 'es6-shim';

ReactDOM.render(
  // <React.StrictMode>
    <Suspense fallback={<div>...</div>}>
      <App />
    </Suspense>
  // </React.StrictMode>
  ,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
