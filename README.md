# fitness-vue — 健身私教管理平台前端

Vue 2 + Element UI 实现的后台管理界面，对接 [fitness-api](https://github.com/AmariStark/fitness-api) 提供的 REST 接口，是一个前后端分离的完整项目。

## 功能

- 登录页：Element 表单校验，调用后端 `/login` 校验账号密码并保存 token
- 路由守卫：未登录访问后台页面自动跳转登录页；已登录则自动补全用户信息
- 后台布局：可折叠侧边菜单 + 顶部栏（显示当前登录人、退出登录）
- 仪表盘：客户总数 / 课程总数 / 课程类型数统计，以及课程类型饼图与客户人群柱状图（ECharts）
- 客户管理：列表、新增、编辑、删除，表单校验
- 课程管理：列表、新增、编辑、删除，表单校验

## 技术栈

| 项目 | 说明 |
| --- | --- |
| Vue | 2.6 |
| 路由 / 状态 | vue-router、Vuex（vuex-persistedstate 持久化） |
| UI | Element UI |
| 请求 | axios 二次封装（请求拦截注入 token、响应拦截统一处理业务码与登录过期） |
| 图表 | ECharts |

## 目录结构

```
src/
├── api/          按模块划分的接口定义（login / user / course）
├── router/       路由表与全局前置守卫
├── store/        Vuex：用户信息与侧边栏状态，刷新后持久化
├── utils/        axios 封装、GET 参数序列化
├── components/   侧边菜单、分页组件
└── views/        登录页、仪表盘、客户管理、课程管理
```

## 运行方式

1. 先启动后端 `fitness-api`（默认 `http://localhost:8088`）

2. 安装依赖并启动：

```bash
npm install
npm run serve
```

访问 `http://localhost:8080`，默认账号 `admin` / `123456`。

3. 生产构建：

```bash
npm run build
```

## 跨域处理

开发环境不依赖后端开 CORS，而是由 `vue.config.js` 里的 devServer 代理转发：

```
浏览器请求 /dev-api/login  →  转发到  http://localhost:8088/login
```

因此 `src/utils/request.js` 里的 `baseURL` 取的是环境变量 `VUE_APP_BASE_API`（`.env.development` 中配置为 `/dev-api`）。

## 请求封装说明

`src/utils/request.js` 做了三件事：

1. 请求拦截：自动在请求头注入 `Authorization: Bearer <token>`，并把 GET 参数拼成查询串（支持嵌套对象与数组）
2. 响应拦截：`code = 200` 直接返回业务数据，其余按错误处理
3. 登录过期：收到 `code = 401` 时弹出提示、清除本地 token 并跳回登录页（用标志位避免重复弹窗）
