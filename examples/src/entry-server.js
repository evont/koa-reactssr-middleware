import React from 'react'
import asyncBootstrapper from 'react-async-bootstrapper'

import App from './App'

export default context =>
  new Promise(async (resolve, reject) => {
    const app = (<App />)

    try {
      await asyncBootstrapper(app)
      const { status, url } = context
      if (status || url) {
        return reject(context)
      }
    } catch (e) {
      return reject(e)
    }

    resolve(app)
  })