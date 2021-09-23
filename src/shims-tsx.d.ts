/*
 * @Author: limit
 * @Date: 2021-08-26 17:55:30
 * @LastEditTime: 2021-08-26 17:58:09
 * @LastEditors: limit
 * @FilePath: /vite-vue3-ts-jsx/src/shims-tsx.d.ts
 * @Description: 由limit创建！
 */
declare module '*.tsx' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
