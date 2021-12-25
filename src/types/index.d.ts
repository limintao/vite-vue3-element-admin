/*
 * @Author: limit
 * @Date: 2021-09-16 16:41:26
 * @LastEditTime: 2021-09-22 12:50:06
 * @LastEditors: limit
 * @FilePath: /basic-services/src/types/index.d.ts
 * @Description: 由limit创建！
 */

import { App } from "vue";
import { RouteRecordRaw } from "vue-router";

export declare type Record<string, any> = {
  [name: string]: any;
};

// 给路由记录对象添加自定义的属性；
export declare type ExpandRouterRaw = RouteRecordRaw & {
  hidden?: boolean,
  children: ExpandRouterRaw[],
}

// 声明路由的meta对象的属性；
export declare type RouteMeta = {
  icon?: string,
  title?: string,
  affix?: boolean,
}

// 安装插件时组件添加 install 属性；
export declare type WithInstall<T> = T & {
  install(app: App): void;
};