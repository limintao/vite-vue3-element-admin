import { Module } from 'vuex';
import { UserState } from "../typings";
import { GlobalState } from '../index';
import { User } from "@/api/types";
import type { RouteLocation } from 'vue-router';
import { login, getUserInfo, getMoveRouter } from "@/api/user";
import { getToken, setToken, removeToken } from "@/utils/auth";
import { resetRouter, asyncRoutes } from "@/router";
import { filterAsyncRouter } from '@/utils';

const getDefaultState = (): UserState => {
  return {
    token: getToken(),
    name: "",
    avatar: "",
    menus: [], //存放路由表的容器
  };
};

const user: Module<UserState, GlobalState> = {
   state: getDefaultState(),
  
   mutations: {
    RESET_STATE: (state: UserState) => {
      Object.assign(state, getDefaultState());
    },
    SET_TOKEN: (state: UserState, token: string | null) => {
      state.token = token;
    },
    SET_NAME: (state: UserState, name: string) => {
      state.name = name;
    },
    SET_AVATAR: (state: UserState, avatar: string) => {
      state.avatar = avatar;
    },
    SET_MENU: (state: UserState, menus: RouteLocation[]) => {
      state.menus = menus;
    },
  },
  
   actions: {
    // user login
    login({ commit }, userInfo: User.LoginParams) {
      const { username, password } = userInfo;
      return new Promise((resolve, reject) => {
        login({
          username: username.trim(),
          password: password,
        })
          .then((response) => {
            const res = response.data;
            commit("SET_TOKEN", res.accessToken);
            setToken(res.accessToken);
            sessionStorage.setItem("Admin-Token", res.accessToken);
            sessionStorage.setItem("userId", res.userId); //存储用户id
            sessionStorage.setItem("tenantId", res.tenantId); //存储租户id
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
  
    // get user info
    getInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUserInfo({
          permission: true,
        })
          .then((response) => {
            let res = response.data;
            sessionStorage.setItem("userInfo", JSON.stringify(res));
            sessionStorage.setItem("deptId", res.deptId); //存储部门id
            const data = {
              name: res.name,
              photo: res.photo,
            };
            if (!data) {
              return reject("验证失败, 请重新登录.");
            }
            const { name, photo } = data; //从data中解构出name 和头像
            commit("SET_NAME", name); //把name 保存到vuex中
            commit("SET_AVATAR", photo); //把头像保存到vuex中
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    // getRouter
    getRouter({ commit, state }) {
      return new Promise((resolve, reject) => {
        let morenRole = JSON.parse(sessionStorage.getItem("userInfo") ?? '').roles[0];
        let path = sessionStorage.getItem("roleCode");
        if (path) {
          morenRole = sessionStorage.getItem("roleCode");
        } else {
          sessionStorage.setItem("roleCode", morenRole);
        }
        getMoveRouter("web")
          .then((response) => {
            const menus = filterAsyncRouter(response.data);
            commit("SET_MENU", menus.concat(asyncRoutes)); //把name 保存到vuex中
            resolve(menus);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    // user logout
    logout({ commit, state, dispatch }) {
      return new Promise((resolve, reject) => {
        commit("SET_TOKEN", "");
        commit("RESET_STATE");
        removeToken();
        resetRouter();
        dispatch("delAllViews", null, {
          root: true,
        });
        sessionStorage.clear();
        resolve('success');
      });
    },
  
    // remove token
    resetToken({ commit }) {
      return new Promise((resolve) => {
        removeToken(); // must remove  token  first //清楚token
        commit("RESET_STATE");
        resolve('success');
      });
    },
  }

}


export default user;
