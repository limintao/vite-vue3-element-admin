/*
 * @Author: limit
 * @Date: 2021-08-26 17:10:37
 * @LastEditTime: 2021-08-27 10:26:31
 * @LastEditors: limit
 * @FilePath: /vite-vue3-ts-jsx/src/vuex-shim.d.ts
 * @Description: 由limit创建！
 */

import { ComponentCustomProperties } from "vue";
import { Store } from "vuex";

declare module "@vue/runtime-core" {
  // 声明自己的 store state
  interface State {
    [name: string]: any;
  }

  // 为 `this.$store` 提供类型声明
  interface ComponentCustomProperties {
    $store: Store<State>;
  }
}
