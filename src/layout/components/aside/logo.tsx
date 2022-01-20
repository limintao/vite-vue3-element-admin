import { defineComponent } from "vue";
import { RouterLink } from "vue-router";
import { useStore } from "@/store";
import settings from "@/settings";
import { getAssetsFileUrl } from "@/utils/file";

export default defineComponent({
  name: "Logo",
  setup() {
    const store = useStore();
    
    return () => (
      <div class="sider-logo sider-collapsed">
        <RouterLink to="/">
          {
            store.getters.sidebar.opened ? <img src={getAssetsFileUrl("images/nav-logo-all.png")} alt="logo" /> :
            <img src={getAssetsFileUrl("images/nav-logo.png")} alt="logo" />
          }
          {/* <h1 title={settings.title}>{settings.title}</h1> */}
        </RouterLink>
      </div>
    )
  }
});