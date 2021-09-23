import { defineComponent, reactive, ref, computed, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "@/store";
import { getAssetsFileUrl } from "@/utils/file";

export default defineComponent({
  name: "NavBar",
  setup() {
    const store = useStore();
    const router = useRouter();
    const data = reactive({});
    const app = getCurrentInstance()?.appContext.config.globalProperties;
    const avatar = computed(() => store.getters.avatar);
    const searchInputRef = ref();
    const showHeaderSearch = ref<boolean>(false);

    const logout = () => {
      app?.$confirm("此操作将退出系统，是否继续？", "操作提示", {
        type: "warning",
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      }).then(async () => {
        try {
          await store.dispatch("logout");
          router.replace("/login");
          app?.$notify({
            title: "操作通知",
            message: "退出登录成功！",
            type: "success"
          });
        } catch (error: any) {
          app?.$notify({
            title: "操作通知",
            message: error,
            type: "error"
          })
        }
      }).catch(() => {})
    };

    const dropdownTmp = () => (
      <el-dropdown-menu class="user-dropdown">
        <router-link to="/">
          <el-dropdown-item>首页</el-dropdown-item>
        </router-link>
        <router-link to="/personalCenter">
          <el-dropdown-item divided>个人中心</el-dropdown-item>
        </router-link>
        <el-dropdown-item divided onClick="changePassword">
          <div>修改密码</div>
        </el-dropdown-item>
        <el-dropdown-item divided onClick={logout}>
          <div>退出登录</div>
        </el-dropdown-item>
      </el-dropdown-menu>
    );

    return () => (
      <header class="layout-header header-action">
        <div class="global-header">
          <div class="header-left-content"></div>
          <el-space warp class="header-right-content">
            <div
              class="header-content-action"
              onClick={() => (
                (showHeaderSearch.value = true), searchInputRef.value?.focus()
              )}
            >
              <i class="el-icon-search"></i>
              <div
                class={
                  "header-content-search-input" +
                  (showHeaderSearch.value
                    ? " header-content-search-input-show"
                    : "")
                }
              >
                <el-input
                  ref={searchInputRef}
                  size="mini"
                  onBlur={() => (showHeaderSearch.value = false)}
                  placeholder="请输入内容"
                />
              </div>
            </div>
            <el-dropdown
              class="header-content-action"
              trigger="click"
              v-slots={{ dropdown: dropdownTmp }}
            >
              <el-space warp>
                <el-avatar
                  size="small"
                  src={avatar.value || getAssetsFileUrl("morengtouxaing.png")}
                />
                <div class="anticon">{store.state.user.name || "admin"}</div>
                <i class="el-icon-arrow-down" />
              </el-space>
            </el-dropdown>
          </el-space>
        </div>
      </header>
    );
  },
});
