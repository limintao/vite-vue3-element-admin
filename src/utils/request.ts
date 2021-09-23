/*
 * @Author: limit
 * @Date: 2021-04-20 12:33:55
 * @LastEditTime: 2021-09-16 15:18:26
 * @LastEditors: limit
 * @FilePath: /vite-vue3-ts-jsx/src/utils/request.ts
 * @Description: 由limit创建！
 */
import axios from "axios";
import { ElMessageBox, ElMessage } from "element-plus";
import { store } from "@/store";
import { getToken } from "./auth";


// const store = useStore();
// console.log( useStore());

// create an axios instance
const service = axios.create({
  baseURL: "",
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 30000, // request timeout
});

// request interceptor
service.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers["Authorization"] = "Bearer " + token;
    }
    return config;
  },
  (error) => {
    // do something with request error
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  (response) => {
    const res = response.data;
    // if the custom code is not 20000, it is judged as an error.
    if (response.status !== 200) {
      ElMessage({
        message: res.msg || "Error",
        type: "error",
        duration: 5 * 1000,
        offset: 110,
      });

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (
        response.status === 50008 ||
        response.status === 50012 ||
        response.status === 50014 ||
        response.status === 402
      ) {
        // to re-login
        ElMessageBox.confirm(
          "You have been logged out, you can cancel to stay on this page, or log in again",
          "Confirm logout",
          {
            confirmButtonText: "Re-Login",
            cancelButtonText: "Cancel",
            type: "warning",
          }
        ).then(() => {
          store.dispatch("resetToken")
          .then(() => {
            location.reload();
          });
        });
      }
      return Promise.reject(new Error(res.msg || "Error"));
    } else {
      return res;
    }
  },
  (error) => {
    ElMessage({
      message: error.response?.data?.msg,
      type: "error",
      duration: 5 * 1000,
      offset: 110,
    });
    return Promise.reject(error);
  }
);

export default service;
