/*
 * @Author: limit
 * @Date: 2021-03-26 15:19:01
 * @LastEditTime: 2021-09-17 16:04:38
 * @LastEditors: limit
 * @FilePath: /vite-vue3-ts-jsx/src/icons/index.ts
 * @Description: 由limit创建！
 */
/*
 * @Author: limit
 * @Date: 2021-03-26 15:19:01
 * @LastEditTime: 2021-09-14 17:38:58
 * @LastEditors: limit
 * @FilePath: /vite-vue3-ts-jsx/src/icons/index.js
 * @Description: 由limit创建！
 */
import { App } from "vue";
import type { WithInstall } from '@/types';
import SvgIcon from '@/components/SvgIcon'// svg component


// register globally
SvgIcon.install = (app: App) => {
  app.component('svg-icon', SvgIcon);
};

export default SvgIcon as WithInstall<typeof SvgIcon>;