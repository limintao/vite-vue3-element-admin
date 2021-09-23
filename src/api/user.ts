/*
 * @Author: limit
 * @Date: 2021-08-27 16:21:59
 * @LastEditTime: 2021-09-22 15:47:48
 * @LastEditors: limit
 * @FilePath: /basic-services/src/api/user.ts
 * @Description: 由limit创建！
 */

import request from "../utils/request";
import { User } from "./types";

// 账号密码登陆接口
export function login(data: User.LoginParams) {
  return request({
    url: "auth/auth/login",
    method: "POST",
    data,
  });
}

// 获取用户详情
export function getUserInfo(params: { permission?: boolean }) {
  return request({
    url: "auth/auth/userInfo",
    method: "GET",
    params,
  });
}

// 获取当前登录人的资源权限列表
export function getMoveRouter(group: string) {
  return request({
    url: `/upms/permission/currentTreeByGroup/` + group,
    method: 'GET',
  })
}

// 修改密码
export function updatePwd(data: User.UpdatePassword) {
  return request({
    url: `upms/user/updatePwd`,
    method: "POST",
    data,
  });
}
