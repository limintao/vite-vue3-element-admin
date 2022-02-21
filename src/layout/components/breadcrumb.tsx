import { defineComponent, ref, withModifiers, TransitionGroup, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "@/store";
import { compile } from "path-to-regexp";
import type { RouteRecordRaw } from "vue-router";

export default defineComponent({
  name: "Breadcrumb",
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const levelList = ref<(RouteRecordRaw | any)[]>([]);

    /* 获取面包屑 */
    const getBreadcrumb = () => {
      let matched: any[] = route.matched.filter(e => e.meta && e.meta.title);
      if (!isDashboard(matched[0])) matched = [{
        path: "/dashboard",
        meta: { title: "首页" }
      }].concat(matched);
      levelList.value = matched.filter(e => e.meta?.title && e.meta?.breadcrumb !== false);
    };

    const isDashboard = (route: any) => {
      const name = route && route.name;
      return name && name.trim().toLocaleLowerCase() === "dashboard";
    };

    /* 地址参数转义 */
    const pathComile = (path: string): string => {
      const { params } = route;
      const toPath = compile(path);
      return toPath(params);
    };

    /* 链接跳转 */
    const handleLink = (item: RouteRecordRaw) => {
      const { redirect, path }: any = item;
      if (redirect) {
        router.push(redirect);
        return;
      };
      router.push(pathComile(path));
    };

    getBreadcrumb();

    /* 侦听数据 */
    watch(() => route, () => {
      getBreadcrumb();
    });

    return () => (
      <el-breadcrumb separator="/">
        <TransitionGroup name="breadcrumb">
          {levelList.value.map((item, index) => (
            <el-breadcrumb-item key={item.path}>
              {item.redirect === "noRedirect" ||
              index == levelList.value.length - 1 ? (
                <span class="no-redirect">{item.meta.title}</span>
              ) : (
                <a onClick={withModifiers(handleLink, ["prevent"])}>{item.meta.title}</a>
              )}
            </el-breadcrumb-item>
          ))}
        </TransitionGroup>
      </el-breadcrumb>
    );
  },
});
