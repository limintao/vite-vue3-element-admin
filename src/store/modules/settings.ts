/*
 * @Author: limit
 * @Date: 2021-03-26 15:19:01
 * @LastEditTime: 2021-08-27 17:46:32
 * @LastEditors: limit
 * @FilePath: /vite-vue3-ts-jsx/src/store/modules/settings.ts
 * @Description: 由limit创建！
 */
import { Module } from 'vuex';
import defaultSettings from "../../settings";
import { SettingsState } from "../typings";
import { GlobalState } from '../index';

const { showSettings, fixedHeader, sidebarLogo, tagsView } = defaultSettings;

interface SetState {
  key: string;
  value: string | boolean;
};

const settings: Module<SettingsState, GlobalState> = {
  state: {
    showSettings: showSettings,
    fixedHeader: fixedHeader,
    sidebarLogo: sidebarLogo,
    tagsView: tagsView,
  },
  
  mutations: {
    CHANGE_SETTING: (state: SettingsState, { key, value }: SetState) => {
      // eslint-disable-next-line no-prototype-builtins
      if (state.hasOwnProperty(key)) {
        state[key] = value;
      }
    },
  },
  
  actions: {
    changeSetting({ commit }: {commit: Function}, data: SetState) {
      commit("CHANGE_SETTING", data);
    },
  },

};


export default settings;
