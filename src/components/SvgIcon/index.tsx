// doc: https://panjiachen.github.io/vue-element-admin-site/feature/component/svg-icon.html#usage
import type { ComputedRef } from "vue";
import { defineComponent, computed } from "vue";
import { isExternal } from "@/utils/validate";
import "./index.scss";

export default defineComponent({
  name: "SvgIcon",
  props: {
    name: {
      type: String,
      default: "",
    },
    color: {
      type: String,
      default: "#1D1D1F"
    }
  },
  setup(props, { attrs }) {
    // 计算属性块
    const hasExternal: ComputedRef<boolean> = computed(() =>
      isExternal(props.name)
    );
    const iconName: ComputedRef<string> = computed(
      () => `#icon-${props.name}`
    );
    const styleExternalIcon: ComputedRef<any> = computed(() => ({
      mask: `url(${props.name}) no-repeat 50% 50%`,
      "-webkit-mask": `url(${props.name}) no-repeat 50% 50%`,
    }));

    return () =>
      hasExternal.value ? (
        <div
          style={styleExternalIcon.value}
          class="svg-external-icon svg-icon"
          {...attrs}
        />
      ) : (
        <svg class="svg-icon" aria-hidden="true" {...attrs}>
          <use xlinkHref={iconName.value} fill={props.color}/>
        </svg>
      );
  },
});
