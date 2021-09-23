/*
 * @Author: limit
 * @Date: 2021-08-26 17:28:48
 * @LastEditTime: 2021-09-22 12:39:53
 * @LastEditors: limit
 * @FilePath: /basic-services/src/router/index.ts
 * @Description: 由limit创建！
 */

import type { RouteRecordRaw, Router } from "vue-router";
import { ExpandRouterRaw } from "@/types";
import { createRouter, createWebHashHistory } from "vue-router";
const Layout = () => import("@/layout");

const routes: (RouteRecordRaw | any)[] = [
  {
    path: "/login",
    hidden: true,
    name: "Login",
    component: () => import("@/views/login/index"),
  },
  {
    path: "/",
    name: "Layout",
    component: Layout,
    redirect: "/homepage",
    children: [
      {
        path: "/homepage",
        name: "HomePage",
        hidden: true,
        component: () => import("@/views/homepage/index"),
        meta: {
          title: "首页",
          icon: "home",
          affix: true,
        },
      },
    ],
  },
];

export const asyncRoutes: ExpandRouterRaw[] = [
  {
    path: "/:pathMatch(.*)*",
    hidden: true,
    name: "not-found",
    children: [],
    component: () => import("@/views/exceptions/404"),
  },
];

let router: Router = createRouter({
  routes: routes,
  scrollBehavior: () => ({
    top: 0,
  }),
  history: createWebHashHistory(),
});

export function resetRouter() {
  router = createRouter({
    routes: routes,
    scrollBehavior: () => ({
      top: 0,
    }),
    history: createWebHashHistory(),
  });
}

export default router;
