import { defineComponent, reactive, ref, withModifiers, withKeys } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "@/store";
import crypto from "@/utils/crypto";
import { getAssetsFileUrl } from "@/utils/file";
import "./index.scss";

export default defineComponent({
  name: "Login",
  setup() {
    const store = useStore();
    const router = useRouter();
    const loginFormRef = ref();
    const usernameRef = ref();
    const passwordRef = ref();
    const data = reactive({
      loginForm: {
        username: "",
        password: "",
      },
      loading: false,
      passwordType: "password",
      redirect: undefined,
    });
    const rules = {
      username: [{ required: true, message: "用户名不能为空" }],
      password: [{ required: true, message: "密码不能为空" }],
    };

    const showPwd = () => {
      data.passwordType = (data.passwordType === "password" ? "text" : "password");
      passwordRef.value?.focus();
    };
    const handleLogin = () => {
      
      loginFormRef.value?.validate((valid: boolean) => {
        if (valid) {
          data.loading = true;
          let params = { ...data.loginForm };
          const passWord = crypto.encrypt(params.password);
          params.password = passWord;
          store.dispatch("login", params)
          .then(() => {
            router.push({ path: "/homepage" || "/" });
          })
          .finally(() => {
            data.loading = false;
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    };

    return () => (
      <div class="login-container">
        <div class="logo">
          <img src={getAssetsFileUrl("images/login-logo.png")} alt="logo.png" />
        </div>
        <div class="salutatory-view">
          <p>HI，新OA，感谢使用</p>
        </div>
        <div class="login-content">
          <div class="title-container">
            <h3 class="title">春晖</h3>
          </div>
          <el-form
            ref={loginFormRef}
            model={data.loginForm}
            rules={rules}
            class="login-form"
            auto-complete="on"
            label-position="left"
          >
            <el-form-item prop="username">
              <span class="svg-container">
                <svg-icon name="user" />
              </span>
              <el-input
                ref={usernameRef}
                v-model={data.loginForm.username}
                placeholder="用户名"
                name="username"
                type="text"
                tabindex="1"
              />
            </el-form-item>

            <el-form-item prop="password">
              <span class="svg-container">
                <svg-icon name="password" />
              </span>
              <el-input
                key="passwordType"
                ref={passwordRef}
                v-model={data.loginForm.password}
                type={data.passwordType}
                placeholder="密码"
                name="password"
                tabindex="2"
                onKeyup={withKeys(handleLogin, ["enter"])}
              />
              <span class="show-pwd" onClick={showPwd}>
                <svg-icon name={data.passwordType === 'password' ? 'eye' : 'eye-open'} />
              </span>
            </el-form-item>

            <el-button
              loading={data.loading}
              type="primary"
              size="medium"
              class="login-button"
              onClick={withModifiers(handleLogin, ["prevent"])}
            >
              立即登录
            </el-button>
          </el-form>
        </div>
        <div class="copy-right">
          <p>Copyright &copy; 北京知新树科技有限公司</p>
        </div>
      </div>
    );
  },
});
