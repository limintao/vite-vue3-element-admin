/*
 * @Author: limit
 * @Date: 2021-09-15 14:03:03
 * @LastEditTime: 2021-09-15 14:08:41
 * @LastEditors: limit
 * @FilePath: /vite-vue3-ts-jsx/src/utils/file.ts
 * @Description: 由limit创建！
 */

/**
 * 
 * @param {String} url    // assets文件夹下的文件；
 * @returns 
 */
export const getAssetsFileUrl = (url: string) :string => {
  return new URL("../assets/" + url, import.meta.url).href;
}