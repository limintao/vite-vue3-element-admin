import { defineComponent, reactive, ref, computed, Slots } from "vue";
import type { _RouteRecordBase } from "vue-router";
import { useRouter, RouterLink, useLink } from "vue-router";
import { useStore } from "@/store";
import settings from "@/settings";
import Logo from "./logo";
import { isExternal } from "@/utils/validate";
import type { RouteMeta, ExpandRouterRaw } from "@/types";

export default defineComponent({
  name: "LayoutAside",
  setup() {
    const store = useStore();
    const router = useRouter();
    const data = reactive({});
    const collapse = computed(() => store.getters.sidebar.opened);
    const menus = computed(() =>
      store.getters.menus.filter((e: any) => !e.hidden)
    );

    const menuItem = (meta: RouteMeta) => (
      <span class="menu-title-content">
        {meta.icon &&
          (meta.icon.startsWith("el-icon") ? (
            <i class={[meta.icon, "sub-el-icon"]} />
          ) : (
            <svg-icon name={meta.icon} />
          ))}
        <span class="ant-pro-menu-item-title">{meta.title}</span>
      </span>
    );

    const renderMenuItem = (item: ExpandRouterRaw, index: string): JSX.Element | boolean => {
      if (item.children?.length == 1 && item.children[0].hidden) return false;
      if (item.children?.length) {
        return (
          <el-sub-menu
            index={index}
            v-slots={{
              title: () => item.meta && menuItem(item.meta),
            }}
          >
            {item.children.map(
              (e: any, i: number) =>
                !e.hidden && renderMenuItem(e, index + "-" + i)
            )}
          </el-sub-menu>
        );
      };
      return (
        <RouterLink to={item.path} custom v-slots={{
          default: ({href}: {[key: string]: any}) => (
            <a href={href} target={isExternal(item.path) ? "_blank": ""}>
              <el-menu-item index={index}>
                {item.meta && menuItem(item.meta)}
              </el-menu-item>
            </a>
          )
        }}>
        </RouterLink>
      );
    };

    return () => (
      <aside class={"layout-sider sider sider-fixed" + (" sider-" + settings.theme)}>
        <div class="layout-sider-children">
          <Logo />
          <div class="layout-sider-content">
            <el-menu class={"menu-" + settings.theme} collapse={!collapse.value}>
              {menus.value.map((item: ExpandRouterRaw, index: number) =>
                renderMenuItem(item, String(index))
              )}
            </el-menu>
          </div>
        </div>
      </aside>
    );
  },
});
