import { defineComponent, reactive } from "vue";
import "./index.scss";
import img_404 from "@/assets/404_images/404.png";
import img_404_cloud from "@/assets/404_images/404_cloud.png";

export default defineComponent({
  name: "NotFound",
  setup() {
    const data = reactive({
      message: "您访问的页面不存在或没有权限...",
    });

    return () => (
      <div class="wscn-http404-container">
        <div class="wscn-http404">
          <div class="pic-404">
            <img class="pic-404__parent" src={img_404} alt="404" />
            <img class="pic-404__child left" src={img_404_cloud} alt="404" />
            <img class="pic-404__child mid" src={img_404_cloud} alt="404" />
            <img class="pic-404__child right" src={img_404_cloud} alt="404" />
          </div>
          <div class="bullshit">
            <div class="bullshit__oops">OOPS!</div>
            <div class="bullshit__headline">{data.message}</div>
            <div class="bullshit__info">
              请检查您输入的网址是否正确，或单击下面的按钮返回主页。
            </div>
            <a href="/" class="bullshit__return-home">
              返回首页
            </a>
          </div>
        </div>
      </div>
    );
  },
});
