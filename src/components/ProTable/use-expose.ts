/*
 * @Author: limit
 * @Date: 2021-09-18 09:43:43
 * @LastEditTime: 2021-09-18 09:49:30
 * @LastEditors: limit
 * @FilePath: /vite-vue3-ts-jsx/src/components/TableLayout/use-expose.ts
 * @Description: 由limit创建！
 */

import { getCurrentInstance } from "vue";

export function useExpose<T = Record<string, any>>(apis: T) {
  const instance = getCurrentInstance();
  if (instance) {
    Object.assign(instance.proxy, apis);
  }
}