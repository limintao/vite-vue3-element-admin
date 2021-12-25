/*
 * @Author: limit
 * @Date: 2021-08-26 17:55:30
 * @LastEditTime: 2021-12-24 16:01:55
 * @LastEditors: limit
 * @FilePath: \basic-services\src\shims-tsx.d.ts
 * @Description: 由limit创建！
 */
declare module '*.tsx' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'e-icon-picker';