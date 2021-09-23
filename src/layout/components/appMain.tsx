import { defineComponent, computed, Transition, KeepAlive, Slots } from "vue";
import { RouterView } from "vue-router";
import { useStore } from "@/store";

export default defineComponent({
  name: "AppMain",
  setup() {
    const store = useStore();
    const cachedViews = computed(() => store.getters.cachedViews);

    return () => (
      <main class="layout-content basicLayout-content">
        <RouterView
          v-slots={{
            default: ({ Component }: Slots) => (
              <Transition name="fade-transform" mode="out-in">
                <KeepAlive include={cachedViews.value}>{Component}</KeepAlive>
              </Transition>
            ),
          }}
        ></RouterView>
      </main>
    );
  },
});
