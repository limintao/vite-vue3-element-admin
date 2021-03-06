/*
 * @Author: limit
 * @Date: 2021-08-26 15:50:05
 * @LastEditTime: 2021-12-24 16:03:45
 * @LastEditors: limit
 * @FilePath: \basic-services\src\main.ts
 * @Description: 由limit创建！
 */
import { createApp } from "vue";
import App from "./App";
import { store, key } from "./store";
import router from "./router";
import ElementPlus from 'element-plus';
import 'virtual:svg-icons-register';
import 'element-plus/dist/index.css';
import 'normalize.css/normalize.css';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import eIconPicker from 'e-icon-picker';
import 'e-icon-picker/lib/index.css'; // 基本样式，包含基本图标

import './styles/index.scss';
import './permission';
import { localData, sessionData } from "../src/utils/local";
import directives from './directives';
import SvgIcon from './icons';
import ProTable from "./components/ProTable";

const app = createApp(App);
app.use(router);
app.use(store, key);
app.use(directives);
app.use(ElementPlus, { size: 'small', zIndex: 999, locale: zhCn, });
app.use(SvgIcon);
app.use(ProTable);
app.use(eIconPicker, {ElementUI: true});

// 全局变量；
app.config.globalProperties.$localData = localData;
app.config.globalProperties.$sessionData = sessionData;

app.mount("#app");
