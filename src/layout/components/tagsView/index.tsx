import {
  defineComponent,
  reactive,
  ref,
  computed,
  onMounted,
  watch,
  nextTick,
  withModifiers,
  provide,
} from "vue";
import { useRouter, useRoute, RouterLink, useLink } from "vue-router";
import { useStore } from "@/store";
import ScrollPane from "./scroll";
import "./index.scss";
import type { RouteLocation } from "vue-router";

declare type TagsView = {
  affixTags: any[];
  top: number;
  left: number;
  selectedTag: any;
  visible: boolean;
};

export default defineComponent({
  name: "TagsView",
  setup() {
    const store = useStore();
    const router = useRouter();
    const $route = useRoute();
    const state = reactive<TagsView>({
      affixTags: [],
      top: 0,
      left: 0,
      visible: false,
      selectedTag: {},
    });
    const currentRef = ref();
    const scrollPaneRef = ref();
    const tagsRef = ref<any[]>([]);

    // 计算属性
    const visitedViews = computed(() => store.state.tagsView.visitedViews);

    const isActive = (route: RouteLocation) => {
      return route.path === $route.path;
    };
    const isAffix = (tag: RouteLocation) => {
      return tag.meta && tag.meta.affix;
    };
    const initTags = () => {
      const affixTags: any[] = (state.affixTags = []);
      for (const tag of affixTags) {
        // Must have tag name
        if (tag.name) store.dispatch("addVisitedView", tag);
      }
    };
    const addTags = () => {
      const { name } = $route;
      if (name) {
        store.dispatch("addView", $route);
      }
      return false;
    };
    const moveToCurrentTag = () => {
      const tags = tagsRef.value;
      nextTick(() => {
        for (const tag of tags) {
          if (tag.to.path === $route.path) {
            scrollPaneRef.value!.moveToTarget(tag);
            // when query is different then update
            if (tag.to.fullPath !== $route.fullPath) {
              store.dispatch("updateVisitedView", $route);
            }
            break;
          }
        }
      });
    };
    const refreshSelectedTag = () => {
      store.dispatch("delCachedView", state.selectedTag).then(() => {
        nextTick(() => {
          router.replace({
            path: "/redirect" + state.selectedTag!.fullPath,
          });
        });
      });
    };
    const closeSelectedTag = () => {
      store.dispatch("delView", state.selectedTag)
      .then(({ visitedViews }) => {
        if (isActive(state.selectedTag)) {
          toLastView(visitedViews, state.selectedTag);
        }
      });
    };
    const closeOthersTags = () => {
      router.push(state.selectedTag);
      store.dispatch("delOthersViews", state.selectedTag).then(() => {
        moveToCurrentTag();
      });
    };
    const closeAllTags = () => {
      store.dispatch("delAllViews").then(({ visitedViews }) => {
        if (
          state.affixTags.some((tag) => tag.path === state.selectedTag.path)
        ) {
          return;
        }
        toLastView(visitedViews, state.selectedTag);
      });
    };
    const toLastView = (visitedViews: RouteLocation[], view: RouteLocation) => {
      const latestView = visitedViews.slice(-1)[0];
      if (latestView) {
        router.push(latestView.fullPath);
      } else {
        // now the default is to redirect to the home page if there is no tags-view,
        // you can adjust it according to your needs.
        if (view.name === "首页") {
          // to reload home page
          router.replace({ path: "/redirect" + view.fullPath });
        } else {
          router.push("/");
        }
      }
    };
    const openMenu = (tag: RouteLocation, e: MouseEvent) => {
      const menuMinWidth = 105;
      const offsetLeft = currentRef.value!.getBoundingClientRect().left; // container margin left
      const offsetWidth = currentRef.value!.offsetWidth; // container width
      const maxLeft = offsetWidth - menuMinWidth; // left boundary
      const left = e.clientX - offsetLeft + 15; // 15: margin right

      if (left > maxLeft) state.left = maxLeft;
      else state.left = left;

      state.top = e.clientY;
      state.visible = true;
      state.selectedTag = tag;
    };

    onMounted(() => {
      initTags();
      addTags();
    });

    provide("tagsRef", tagsRef);

    /* 侦听器 */
    watch(
      () => state.visible,
      (visible) => {
        if (visible) {
          document.body.addEventListener("click", () => (state.visible = false));
        } else {
          document.body.removeEventListener("click", () => (state.visible = false));
        }
      }
    );
    watch($route, () => {
      addTags();
      moveToCurrentTag();
    });

    return () => (
      <div id="tags-view-container" ref={currentRef}>
        <ScrollPane ref={scrollPaneRef} class="tags-view-wrapper">
          {visitedViews.value.map((item, index) => (
            <RouterLink
              ref={(el: any) => {
                if (el) tagsRef.value[index] = el
              }}
              key={item.path}
              to={{...item}}
              custom
              v-slots={{
                default: () => (<span class={["tags-view-item", isActive(item) && "active"]}>
                  {/* @ts-expect-error */}
                  <span>{item.title}</span>
                  {!isAffix(item) ? (
                    <span
                      class="el-icon-close"
                      onClick={withModifiers(closeSelectedTag, ["prevent", "stop"])}
                    />
                  ) : null}
                </span>)
              }}
            />
          ))}
        </ScrollPane>
        <ul
          v-show={state.visible}
          style={{ left: state.left + "px", top: state.top + "px" }}
          class="contextmenu"
        >
          <li onClick={refreshSelectedTag}>刷新</li>
          {!isAffix(state.selectedTag) && (
            <li onClick={closeSelectedTag}>
              关闭
            </li>
          )}
          <li onClick={closeAllTags}>关闭全部</li>
        </ul>
      </div>
    );
  },
});
