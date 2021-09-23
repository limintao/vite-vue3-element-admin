/*
 * @Author: limit
 * @Date: 2021-03-26 15:19:01
 * @LastEditTime: 2021-08-27 16:27:37
 * @LastEditors: limit
 * @FilePath: /vite-vue3-ts-jsx/src/utils/auth.ts
 * @Description: 由limit创建！
 */
import Cookies from "js-cookie";

const TokenKey = "Admin-Token";

export function getToken(): string {
  return Cookies.get(TokenKey) ?? '';
}

export function setToken(token: string): string | undefined {
  return Cookies.set(TokenKey, token);
}

export function removeToken(): void {
  Cookies.remove(TokenKey);
}
export function setUser(user: JSON): void {
  const userStr = JSON.stringify(user);
  sessionStorage.setItem("user", userStr);
}
export function getUser(): string {
  const userStr = sessionStorage.getItem("user");
  return userStr && JSON.parse(userStr);
}

export function removeUser(): void {
  sessionStorage.clear();
}
