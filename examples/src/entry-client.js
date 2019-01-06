import React from 'react'
import asyncBootstrapper from 'react-async-bootstrapper'
import { hydrate } from 'react-dom'

import App from './App'

if (!__DEV__) {
  delete window.__INITIAL_STATE__
  delete window.ASYNC_COMPONENTS_STATE
}

const render = () => {
  const app = (<App />)

  asyncBootstrapper(app).then(() =>
    hydrate(app, document.getElementById('app')),
  )
}

render()

if (__DEV__) {
  module.hot.accept('./App', render)
}

if (
  !__DEV__ &&
  (location.protocol === 'https:' ||
    ['127.0.0.1', 'localhost'].includes(location.hostname)) &&
  navigator.serviceWorker
) {
  navigator.serviceWorker.register('/service-worker.js')
}