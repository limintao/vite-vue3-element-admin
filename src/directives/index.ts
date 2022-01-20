/*
 * @Author: limit
 * @Date: 2021-04-02 11:14:23
 * @LastEditTime: 2021-09-22 15:02:02
 * @LastEditors: limit
 * @FilePath: /basic-services/src/directives/index.ts
 * @Description: 由limit创建！
 */
import { App } from "vue";

export default {
  install(app: App) {
    // 手机号验证指令；
    app.directive("phone", {
      mounted(el, binding) {
        el.addEventListener("input", function (e: any) {
          const reg = /\d/;
          const oldValue = e.target.value;
          const value = e.data;
          if (!value) return;
          if (!reg.test(value) || oldValue.length > 11)
            e.target.value = oldValue.slice(0, oldValue.length - value.length);
        });
      },
    });
    
    // 身份证验证指令；
    app.directive("idcard", {
      mounted(el, binding) {
        el.addEventListener("input", function (e: any) {
          const oldValue = e.target.value;
          const value = e.data;
          const reg = /\d/;
          if (
            oldValue.length == 18 ||
            (oldValue.length == 15 && (value.endsWith("x") || value.endsWith("X")))
          )
            return;
          if (!reg.test(value) || oldValue.length > 18)
            e.target.value = oldValue.slice(0, oldValue.length - value.length);
        });
      },
    });
    
    // 防止用户快速点击指令；
    app.directive("dbClick", {
      mounted(el, binding) {
        el.addEventListener("click", () => {
          const iEle: Element = document.createElement("i");
          iEle.classList.add("el-icon-loading");
          if (!el.disabled) {
            const oldValue = el.children[0].innerText;
            el.disabled = true;
            el.children[0].innerText = binding.value || "保存中...";
            el.insertBefore(iEle, el.firstElementChild);
            el.style.cursor = "wait";
            setTimeout(() => {
              iEle.remove();
              el.style.cursor = "pointer";
              el.disabled = false;
              el.children[0].innerText = oldValue;
            }, 1500);
          }
        });
      },
    });
    
    // 按钮权限控制指令；
    app.directive("permission", {
      // 当被绑定的元素插入到 DOM 中时……
      mounted(el, binding, node) {
        const { code, show = true } = binding.value;
        const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
        
        const roles = userInfo.permissions;
        if (roles.includes(code) && show) return code;
        else el.parentNode && el.parentNode.removeChild(el);
        //使用方式： v-permission="{ code: 'base:tenant:add' }";
        //"base:tenant:delete"删除  "base:tenant:export" 导出  "base:tenant:add" 增加 "base:tenant:update" //修改
      },
    });

  }
};