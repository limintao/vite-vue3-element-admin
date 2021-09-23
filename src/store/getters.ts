/*
 * @Author: limit
 * @Date: 2021-03-26 15:19:01
 * @LastEditTime: 2021-08-27 14:36:59
 * @LastEditors: limit
 * @FilePath: /vite-vue3-ts-jsx/src/store/getters.ts
 * @Description: 由limit创建！
 */
const getters = {
  sidebar: (state: any) => state.app.sidebar,
  device: (state: any) => state.app.device,
  token: (state: any) => state.user.token,
  avatar: (state: any) => state.user.avatar,
  name: (state: any) => state.user.name,
  menus: (state: any) => state.user.menus,
  cachedViews: (state: any) => state.tagsView.cachedViews,
};

export default getters;