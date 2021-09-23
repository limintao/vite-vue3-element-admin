import { defineComponent, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "@/store";
import "./index.scss";

import { AppMain, Aside, NavBar } from "./components";

export default defineComponent({
  name: "Layout",
  setup() {
    const store = useStore();
    const router = useRouter();
    const data = reactive({});
    
    return () => (
      <div class="layout-basic">
        <section class="layout layout-has-sider">
          <div style="width: 250px"></div>
          <Aside />
          <div class="layout">
            <NavBar />
            <AppMain />
          </div>
        </section>
      </div>
    )
  }
});