# Koa-ReactSSR
基于Koa 2.x 的React SSR 中间件（Reat SSR middleware for `koa 2.x`）

## **installation**

```javascript
npm install koa-reactssr-middleware
```
---
## **用法**
如果你需要运行在生产环境中，你需要先在`package.json` 文件中配置`scripts`字段，
```json
  "scripts": {
    "build": "reactssr"
  }
```
然后执行 `npm run build` 命令生成生产代码

```javascript
const koa = require('koa');
const app = new koa();
const koaRouter = require('koa-router');
const ssr = require('koa-reactssr-middleware');

router.get('/otherroute', othermiddleware);
router.get('*', ssr(app, opts));

app.use(router.routes());
app.listen(8080);
```

- `app` koa 的app 实例
- `opts` 配置选项

    **Options**
    - `title` 页面默认标题，默认为空；
    - `isProd` 是否为生产模式，默认为 `false`，如果设置为 `true`，你需要先生成生产代码，为`false` 时，该中间件会使用 `webpack-hot-middleware`& `webpack-dev-middleware` 以实现热更新功能；
    - ~~`templatePath` 默认网页模板，默认为空，即使用内置的网页模板~~
---

你需要在项目根目录下有一个 `.ssrconfig` 作为配置文件，以下是配置例子

.ssrconfig
```json
{
  "template": "./src/index.template.html",
  "ouput": {
    "path": "./dist", 
    "publicPath": "/dist/"
  },
  "entry": {
    "client": "./src/entry-client.js",
    "server": "./src/entry-server.js"
  },
  "webpackConfig": {
    "client": "./build/webpack.client.conf.js",
    "server": "./build/webpack.server.conf.js"
  }
}
```
- `template` 默认网页模板，默认为空，即使用内置的网页模板
- `entry` 当你想要使用内置webpack 配置文件的时候为**必要**选项。 webpack的入口js， `client` 是客户端入口文件, `server` 为服务端入口文件;
- `output` 如果你想使用内置webpack 配置文件的时候，你需要声明输出目录选项， `path` 为输出的文件夹目录，`publicPath` 是生成到模板中时的资源路径, 具体可以参考 [webpack output 配置](https://webpack.js.org/configuration/output/)
- `webpackConfig` 如果你倾向于使用你自己的webpack 配置文件，你需要配置下列选项: 
    - `client` 客户端配置webpack 配置
    - `server` 服务端配置webpack 配置

---

实际使用可以参考 [Demo](https://github.com/evont/koa-reactssr-middleware/tree/master/examples) 

目录结构示例

```
├── src                      app directory
│   ├── router/              route directory
│   ├── views/               views directory
│   ├── components/          compoennts directory
│   ├── App.js               js file to export an App
│   ├── entry-server.js      server side entry point
│   └── entry-client.js      client side entry point
├── index.js                 server entry point
├── .ssrconfig               SSR configuration file
├── ...	
```

App.js 例子 

```javascript
import React from 'react'
export default class HomeView extends React.PureComponent {
  render() {
    return <div>test</div>
  }
}
```

entry-client.js 例子

```javascript
import React from 'react'
import asyncBootstrapper from 'react-async-bootstrapper'
import { hydrate } from 'react-dom'

import App from './App'

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
```

entry-server.js 例子

```javascript
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
```