/*
 * @Author: limit
 * @Date: 2021-08-27 14:43:40
 * @LastEditTime: 2021-09-17 10:30:16
 * @LastEditors: limit
 * @FilePath: /vite-vue3-ts-jsx/src/store/typings/index.ts
 * @Description: 由limit创建！
 */
import { RouteLocation, RouteRecordName } from 'vue-router';

export interface AppState {
  sidebar: {
    opened: boolean,
    withoutAnimation: boolean
  },
  device: string,
  deviceWidth: number,
}

export interface SettingsState {
  showSettings: boolean,
  fixedHeader: boolean,
  sidebarLogo: boolean,
  tagsView: boolean,
  [key: string]: boolean | string,
}

export interface TagsState {
  visitedViews: RouteLocation[],
  cachedViews: RouteRecordName[],
}

export interface UserState {
  token: null | string,
  name: string,
  avatar: string,
  menus: RouteLocation[], //存放路由表的容器
}
