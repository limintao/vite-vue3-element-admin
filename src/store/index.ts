/*
 * @Author: limit
 * @Date: 2021-08-26 17:20:45
 * @LastEditTime: 2021-08-27 16:54:40
 * @LastEditors: limit
 * @FilePath: /vite-vue3-ts-jsx/src/store/index.ts
 * @Description: 由limit创建！
 */

import { InjectionKey } from "vue";
import { createStore, useStore as baseUseStore, Store } from "vuex";
import { AppState, SettingsState, UserState, TagsState } from './typings';
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import tagsView from './modules/tagsView'

export interface GlobalState {
  app: AppState,
  user: UserState,
  tagsView: TagsState,
  settings: SettingsState,
}

export const key: InjectionKey<Store<GlobalState>> = Symbol();

export const store = createStore<GlobalState>({
  modules: {
    app,
    settings,
    user,
    tagsView
  },
  getters
});

// 定义自己的 `useStore` 组合式函数
export function useStore() {
  return baseUseStore(key);
}
