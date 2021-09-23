/*
 * @Author: limit
 * @Date: 2021-08-27 09:59:05
 * @LastEditTime: 2021-09-22 11:16:53
 * @LastEditors: limit
 * @FilePath: /basic-services/src/permission.ts
 * @Description: 由limit创建！
 */

import type { RouteLocationNormalized, RouteRecordRaw } from 'vue-router';
import { store } from "./store";
import settings from './settings';
import router from "./router";
import { ElNotification } from 'element-plus';
import { getToken } from './utils/auth';
import NProgress from "nprogress";
import "nprogress/nprogress.css";
NProgress.configure({
  showSpinner: false,
});

const whiteList = ['/login'];

router.beforeEach(async (to: RouteLocationNormalized, from: RouteLocationNormalized) => {
  NProgress.start();
  // 设置网页标题；
  (document as any).title = to.meta.title || settings.title;
  const hasToken = getToken(); //获取cookie中的token
  
  if (hasToken) {
    if (to.path == "/login") (router.replace("/"), NProgress.done());
    else {
      const hasUserInfo = store?.getters.name;
      if (hasUserInfo) return true;
      else {
        try {
          await store.dispatch('getInfo') //触发获取用户信息到接口
          await store.dispatch('getRouter') //触发获取路由表的接口
          if (store.getters.menus.length < 1) return true;
          store.getters.menus.forEach((item: RouteRecordRaw) => {
            router.addRoute(item) //动态添加路由
          });
          router.replace({...to, replace: true});
        } catch (error: any) {
          await store.dispatch('resetToken') //触发vuex中  resetToken
          ElNotification({ message: error || 'Has Error', title: "系统错误"}) //弹出异常
          router.replace(`/login?redirect=${to.path}`) //然后就执行这里 跳转到 login  redirect把从哪个页面出错的 
          NProgress.done();
        }
      }
    }
  } else {
    if (whiteList.join().indexOf(to.path) !== -1) return true;
    else router.replace(`/login?redirect=${to.path}`);
    NProgress.done();
  }
  return true;
});

// 路由加载后；
router.afterEach(() => {
  NProgress.done()
});