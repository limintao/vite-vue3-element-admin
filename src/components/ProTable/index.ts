/*
 * @Author: limit
 * @Date: 2021-09-17 15:51:55
 * @LastEditTime: 2021-09-18 10:17:23
 * @LastEditors: limit
 * @FilePath: /vite-vue3-ts-jsx/src/components/ProTable/index.ts
 * @Description: 由limit创建！
 */

import { App } from "vue";
import ProTable from "./ProTable";
import type { WithInstall } from "@/types";

ProTable.install = (app: App) => {
  app.component("pro-table", ProTable);
}

export default ProTable as WithInstall<typeof ProTable>;