/*
 * @Author: limit
 * @Date: 2021-08-26 15:53:32
 * @LastEditTime: 2021-08-26 15:55:21
 * @LastEditors: limit
 * @FilePath: /vite-vue3-ts-jsx/babel.config.js
 * @Description: 由limit创建！
 */

module.exports = {
  presets: ["@vue/cli-plugin-babel/preset"],
  plugins: [
    "@vue/babel-plugin-jsx",
    "@babel/plugin-proposal-optional-chaining",
  ],
};