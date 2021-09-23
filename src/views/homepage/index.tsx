import { defineComponent } from "vue";
import { getAssetsFileUrl } from "@/utils/file";

export default defineComponent({
  name: "HomePage",
  setup() {
    
    return () => (
      <div class="app-container" style="height: 100%;">
        <img src={getAssetsFileUrl("images/dashboard.svg")} style="width: 100%; height: 100%;" />
      </div>
    )
  }
});