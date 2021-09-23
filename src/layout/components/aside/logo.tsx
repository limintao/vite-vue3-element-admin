import { defineComponent } from "vue";
import { RouterLink } from "vue-router";
import settings from "@/settings";
import { getAssetsFileUrl } from "@/utils/file";

export default defineComponent({
  name: "Logo",
  setup() {
    
    return () => (
      <div class="sider-logo sider-collapsed">
        <RouterLink to="/">
          <img src={getAssetsFileUrl("images/logo.png")} alt="logo" />
          <h1 title={settings.title}>{settings.title}</h1>
        </RouterLink>
      </div>
    )
  }
});