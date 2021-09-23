import { Module } from "vuex";
import { TagsState } from "../typings";
import { GlobalState } from "../index";
import { RouteLocation } from "vue-router";

const tagsView: Module<TagsState, GlobalState> = {
  state: {
    visitedViews: [],
    cachedViews: [],
  },

  mutations: {
    ADD_VISITED_VIEW: (state: TagsState, view: RouteLocation) => {
      if (state.visitedViews.some((v) => v.path === view.path)) return;
      state.visitedViews.push(
        Object.assign({}, view, {
          title: view.meta.title || "no-name",
        })
      );
    },
    ADD_CACHED_VIEW: (state: TagsState, view: RouteLocation) => {
      if (!view.name) return;
      if (state.cachedViews.includes(view.name)) return;
      if (!view.meta.noCache) {
        // console.log(view.matched[view.matched.length - 1].name);
        // console.log(view.matched);
        // 解决 三级路由（菜单） 关闭后，重新进入该路由（菜单） 还是缓存状态的bug
        if (view.matched.length >= 3) {
          let arr = [
            view.matched[view.matched.length - 2]?.name ?? "no-name",
            view.matched[view.matched.length - 1]?.name ?? "no-name",
          ];
          state.cachedViews.push(...arr);
        } else {
          state.cachedViews.push(view.name);
        }
        // state.cachedViews.push(view.name)
      }
    },

    DEL_VISITED_VIEW: (state: TagsState, view: RouteLocation) => {
      for (const [i, v] of state.visitedViews.entries()) {
        if (v.path === view.path) {
          state.visitedViews.splice(i, 1);
          break;
        }
      }
    },
    DEL_CACHED_VIEW: (state: TagsState, view: RouteLocation) => {
      if (!view.name) return;
      const index = state.cachedViews.indexOf(view.name);
      index > -1 && state.cachedViews.splice(index, 1);
    },

    DEL_OTHERS_VISITED_VIEWS: (state: TagsState, view: RouteLocation) => {
      state.visitedViews = state.visitedViews.filter((v) => {
        return v.meta.affix || v.path === view.path;
      });
    },
    DEL_OTHERS_CACHED_VIEWS: (state: TagsState, view: RouteLocation) => {
      if (!view.name) return;
      const index = state.cachedViews.indexOf(view.name);
      if (index > -1) {
        state.cachedViews = state.cachedViews.slice(index, index + 1);
      } else {
        // if index = -1, there is no cached tags
        state.cachedViews = [];
      }
    },

    DEL_ALL_VISITED_VIEWS: (state: TagsState) => {
      // keep affix tags
      const affixTags = state.visitedViews.filter((tag) => tag.meta.affix);
      state.visitedViews = affixTags;
    },
    DEL_ALL_CACHED_VIEWS: (state: TagsState) => {
      state.cachedViews = [];
    },

    UPDATE_VISITED_VIEW: (state: TagsState, view: RouteLocation) => {
      for (let v of state.visitedViews) {
        if (v.path === view.path) {
          v = Object.assign(v, view);
          break;
        }
      }
    },
  },

  actions: {
    addView({ dispatch }, view: RouteLocation) {
      dispatch("addVisitedView", view);
      dispatch("addCachedView", view);
    },
    addVisitedView({ commit }, view: RouteLocation) {
      commit("ADD_VISITED_VIEW", view);
    },
    addCachedView({ commit }, view: RouteLocation) {
      commit("ADD_CACHED_VIEW", view);
    },

    delView({ dispatch, state }, view: RouteLocation) {
      return new Promise((resolve) => {
        dispatch("delVisitedView", view);
        dispatch("delCachedView", view);
        // 解决 三级路由（菜单） 关闭后，重新进入该路由（菜单） 还是缓存状态的bug
        if (view.matched.length >= 3) {
          let str = view.matched[view.matched.length - 2].name;
          let arr = [...state.cachedViews].filter((x) => x !== str);
          state.cachedViews = arr;
        }
        resolve({
          visitedViews: [...state.visitedViews],
          cachedViews: [...state.cachedViews],
        });
      });
    },
    delVisitedView({ commit, state }, view: RouteLocation) {
      return new Promise((resolve) => {
        commit("DEL_VISITED_VIEW", view);
        resolve([...state.visitedViews]);
      });
    },
    delCachedView({ commit, state }, view: RouteLocation) {
      return new Promise((resolve) => {
        commit("DEL_CACHED_VIEW", view);
        resolve([...state.cachedViews]);
      });
    },

    delOthersViews({ dispatch, state }, view: RouteLocation) {
      return new Promise((resolve) => {
        dispatch("delOthersVisitedViews", view);
        dispatch("delOthersCachedViews", view);
        resolve({
          visitedViews: [...state.visitedViews],
          cachedViews: [...state.cachedViews],
        });
      });
    },
    delOthersVisitedViews({ commit, state }, view: RouteLocation) {
      return new Promise((resolve) => {
        commit("DEL_OTHERS_VISITED_VIEWS", view);
        resolve([...state.visitedViews]);
      });
    },
    delOthersCachedViews({ commit, state }, view: RouteLocation) {
      return new Promise((resolve) => {
        commit("DEL_OTHERS_CACHED_VIEWS", view);
        resolve([...state.cachedViews]);
      });
    },

    delAllViews({ dispatch, state }, view: RouteLocation) {
      return new Promise((resolve) => {
        dispatch("delAllVisitedViews", view);
        dispatch("delAllCachedViews", view);
        resolve({
          visitedViews: [...state.visitedViews],
          cachedViews: [...state.cachedViews],
        });
      });
    },
    delAllVisitedViews({ commit, state }) {
      return new Promise((resolve) => {
        commit("DEL_ALL_VISITED_VIEWS");
        resolve([...state.visitedViews]);
      });
    },
    delAllCachedViews({ commit, state }) {
      return new Promise((resolve) => {
        commit("DEL_ALL_CACHED_VIEWS");
        resolve([...state.cachedViews]);
      });
    },

    updateVisitedView({ commit }, view: RouteLocation) {
      commit("UPDATE_VISITED_VIEW", view);
    },
  },
};

export default tagsView;
