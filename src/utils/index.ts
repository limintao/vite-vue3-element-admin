/*
 * @Author: limit
 * @Date: 2021-03-26 15:19:01
 * @LastEditTime: 2021-09-22 11:21:33
 * @LastEditors: limit
 * @FilePath: /basic-services/src/utils/index.ts
 * @Description: 由limit创建！
 */

import { ExpandRouterRaw } from "@/types";
import { ElMessage } from "element-plus";

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export const parseTime = function (
  time: Date | string | number,
  cFormat: string
): string {
  const format = cFormat || "{y}-{m}-{d} {h}:{i}:{s}";
  let date;
  if (typeof time === "object") {
    date = time;
  } else {
    if (typeof time === "string") {
      if (/^[0-9]+$/.test(time)) {
        // support "1548221490638"
        time = parseInt(time);
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), "/");
      }
    }

    if (typeof time === "number" && time.toString().length === 10) {
      time = time * 1000;
    }
    date = new Date(time);
  }
  const formatObj: any = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  };
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key];
    // Note: getDay() returns 0 on Sunday
    if (key === "a") {
      return ["日", "一", "二", "三", "四", "五", "六"][value];
    }
    return value.toString().padStart(2, "0");
  });
  return time_str;
};

interface AnalyseObj {
  birthDate: () => string;
  sex: () => string;
  age: () => number;
}

/**
 * @description 解析身份证信息
 * @param {String} idCard - 身份证号
 * @param {String} analyseType - 解析类型（birthDate-出生日期 sex-性别 age-年龄）
 * @return {String | Number}
 */
export const getAnalysisIdCard = (
  idCard: string = "",
  analyseType: "birthDate" | "sex" | "age"
): string | number => {
  const analyseObj: AnalyseObj = {
    birthDate: (): string => {
      // 获取出生日期
      const birth = `${idCard.substring(6, 10)}-${idCard.substring(
        10,
        12
      )}-${idCard.substring(12, 14)}`;
      return birth;
    },
    sex: (): string => {
      //获取性别
      const sex = parseInt(idCard.substr(16, 1)) % 2 === 1 ? "男" : "女";
      return sex;
    },
    age: (): number => {
      //获取年龄(计算周岁，未过今年的生日则不加上一岁)
      const myDate = new Date(),
        month = myDate.getMonth() + 1,
        day = myDate.getDate();
      let age = myDate.getFullYear() - Number(idCard.substring(6, 10)) - 1;
      if (
        Number(idCard.substring(10, 12)) < month ||
        (Number(idCard.substring(10, 12)) == month &&
          Number(idCard.substring(12, 14)) <= day)
      ) {
        age++;
      }
      return age;
    },
  };
  if (!analyseObj[analyseType]) {
    throw new Error("请传入正确的解析类型！");
  }
  return analyseObj[analyseType]();
};

//  遍历后台传来的路由字符串，转换为组件对象
export const filterAsyncRouter = (
  asyncRouterMap: ExpandRouterRaw[]
): ExpandRouterRaw[] => {
  const modules = import.meta.glob("../views/*/*.tsx");
  const accessedRouters: ExpandRouterRaw[] = asyncRouterMap.filter(
    (route: any) => {
      if (route.component) {
        if (route.component === "Layout")
          route.component = () => import("@/layout");
        else if (route.component === "App")
          route.component = () => import("@/App");
        else if (route.component === "Container")
          route.component = () => import("@/layout/components/appMain");
        else {
          const component = modules["../views/" + route.component + ".tsx"];
          if (!component) {
            console.error(route.name + " 的组件地址不存在！");
            route.component = () => import("@/views/homepage"); // 导入组件
            ElMessage.error("请查看控制台修改或者删除不存在的组件路径"); //弹出异常('请修改或者删除不存在的组件路径')
          } else {
            route.component = component; // 导入组件
          }
        }
      };

      if (route.children && route.children?.length) {
        route.children = filterAsyncRouter(route.children);
      };
      return true;
    }
  );

  return accessedRouters;
};
