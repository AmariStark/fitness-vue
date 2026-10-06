import axios from "axios";
import { MessageBox } from "element-ui";
import router from "@/router";
import { transParams } from "./data";

// baseURL 走 vue.config.js 里配置的代理，开发环境为 /dev-api
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
});

// 防止登录过期时弹出多个提示框
let redirecting = false;

function handleUnauthorized(message) {
  if (redirecting) {
    return;
  }
  redirecting = true;
  MessageBox({
    title: "提示",
    message: message || "您的登录已过期，请重新登录",
    showCancelButton: false,
    showClose: false,
    closeOnClickModal: false,
    closeOnPressEscape: false
  })
    .then(() => {
      localStorage.removeItem("token");
      router.push({ path: "/login" });
    })
    .catch(() => {})
    .finally(() => {
      redirecting = false;
    });
}

// 请求拦截：统一带上 token，并把 get 参数拼成查询串
service.interceptors.request.use(
  config => {
    const token = localStorage.getItem("token");
    if (token && config.url !== "/login") {
      config.headers.Authorization = "Bearer " + token;
    }

    if (config.method === "get" && config.params) {
      const query = transParams(config.params);
      if (query) {
        config.url = config.url + "?" + query;
      }
      config.params = {};
    }

    return config;
  },
  err => Promise.reject(err)
);

// 响应拦截：code=200 放行，401 统一跳登录，其余按错误处理
service.interceptors.response.use(
  res => {
    // 文件流直接返回，不做业务码判断
    if (res.request && res.request.responseType === "blob") {
      return res.data;
    }

    const body = res.data;
    if (body && body.code === 200) {
      return body;
    }
    if (body && body.code === 401) {
      handleUnauthorized(body.msg);
      return Promise.reject(body);
    }
    return Promise.reject(body || { msg: "请求失败" });
  },
  err => {
    const body = err.response && err.response.data;
    if (body && body.code === 401) {
      handleUnauthorized(body.msg);
      return Promise.reject(body);
    }
    return Promise.reject(body || err);
  }
);

export default service;
