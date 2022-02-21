/*
 * @Author: limit
 * @Date: 2021-03-26 15:19:01
 * @LastEditTime: 2022-02-17 10:53:23
 * @LastEditors: limit
 * @FilePath: /basic-services-v3/src/store/modules/app.ts
 * @Description: 由limit创建！
 */
import { Module } from 'vuex';
import Cookies from "js-cookie";
import { AppState } from "../typings";
import { GlobalState } from '../index';

const app: Module<AppState, GlobalState> = {

  state: {
    sidebar: {
      opened: Cookies.get("sidebarStatus")
        ? !!+(Cookies.get("sidebarStatus") ?? false)
        : true,
      withoutAnimation: false,
    },
    device: "desktop",
    deviceWidth: 1920,
  },
  
  mutations: {
    TOGGLE_SIDEBAR: (state: AppState) => {
      state.sidebar.opened = !state.sidebar.opened;
      state.sidebar.withoutAnimation = false;
      if (state.sidebar.opened) {
        Cookies.set("sidebarStatus", '1');
      } else {
        Cookies.set("sidebarStatus", '0');
      }
    },
    CLOSE_SIDEBAR: (state: AppState, withoutAnimation: boolean) => {
      Cookies.set("sidebarStatus", '0');
      state.sidebar.opened = false;
      state.sidebar.withoutAnimation = withoutAnimation;
    },
    TOGGLE_DEVICE: (state: AppState, device: string) => {
      state.device = device;
    },
    DEVICCE_WIDTH: (state: AppState, width: number) => {
      state.deviceWidth = width;
    },
  },
  
  actions: {
    toggleSideBar({ commit }: { commit: Function }) {
      commit("TOGGLE_SIDEBAR");
    },
    closeSideBar({ commit }: { commit: Function }, { withoutAnimation }: { withoutAnimation: boolean }) {
      commit("CLOSE_SIDEBAR", withoutAnimation);
    },
    toggleDevice({ commit }: { commit: Function }, device: string) {
      commit("TOGGLE_DEVICE", device);
    },
  },
}

export default app;