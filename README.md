## 基于vue-electron

### 项目由来


### 工程目录
``` bash
│
├── README.md                           <=  项目介绍
├── app                                 <=  开发目录
│   ├── dist                            <= 编译打包
│   ├── icons                           <= 相关图标
│   ├── src                             <= 项目源代码
│   │   ├── main                        <= electron主进程
│   │   │   ├── application.js
│   │   │   ├── index.dev.js
│   │   │   ├── index.js
│   │   ├── renderer                    <= electron渲染进程
│   │   │   ├── App.vue                 <=  Vue 根组件
│   │   │   ├── main.js                 <=  Vue 入口
│   │   │   ├── assets                  <=  静态资源
│   │   │   ├── common                  <=  公共配置
│   │   │   ├── config                  <=  项目配置
│   │   │   ├── extend                  <=  Vue 扩展相关
│   │   │   ├── router                  <=  Vue 路由相关
│   │   │   ├── store                   <=  Vuex
│   │   │   ├── views                   <=  视图层
│   │   ├── config.js                   <= blockchain-sdk节点链接配置等
│   ├── index.ejs                       <= 模板文件
│   ├── package.json                    <=  相关依赖
├── build                               <=  打包桌面应用相关
│   ├── Gruntfile.js                    <=  构建脚本
│   ├── package.json                    <=  相关依赖
├── tasks                               <=  electron-packeger打包
│   ├── release.js
│   ├── runner.js
├── test                                <=  测试文件夹
│   ├── e2e
│   ├── unit
│   ├── .eslintrc
├── config.js                           <=  electron打包配置
├── webpack.main.config.js
├── webpack.renderer.config.js
├── package.js
│
│
```

### 使用说明

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:9080
npm run dev

# build electron app for production
npm run build

# lint all JS/Vue component files in `app/src`
npm run lint

# run webpack in production
npm run pack

```

### 打包说明--2019-02-26新增

``` 
# 开发环境-单节点-钱包
npm run dev-Lite

# 开发环境-全节点-钱包
npm run dev

# 生产环境打包-单节点
npm run build:win32-Lite || npm run build:darwin-Lite

# 生产环境打包-全节点
npm run build:win32 || npm run build:darwin

```
---
