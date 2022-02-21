import {
  defineComponent,
  onMounted,
  onBeforeUnmount,
  ref,
  inject,
  withModifiers,
} from "vue";
import type { ElScrollbar } from "element-plus";
import "./index.scss";

export default defineComponent({
  name: "scroll",
  setup(props, { emit, slots, expose }) {
    const scrollRef = ref<InstanceType<typeof ElScrollbar>>();
    const tagAndTagSpacing = 4;
    const tagList = inject<any>("tagsRef")?.value;

    const handleScroll = (e: WheelEvent & { wheelDelta: number }) => {
      const eventDelta = e.wheelDelta || -e.deltaY * 40;
      // @ts-expect-error
      scrollRef.value!.wrap!.scrollLeft = scrollRef.value!.wrap!.scrollLeft + eventDelta / 4;
    };

    // 组件挂载完成事件
    onMounted(() => 
      // @ts-expect-error
      scrollRef.value!.wrap!.addEventListener("scroll", () => emit("scroll"), true)
    );

    // 写在组件之前的事件
    onBeforeUnmount(() =>
      // @ts-expect-error
      scrollRef.value!.wrap!.removeEventListener("scroll", () => emit("scroll"))
    );

    expose({ moveToTarget: (currentTag: Element) => {
      const $container = scrollRef.value?.$el;
      const $containerWidth = $container.offsetWidth;
      // @ts-expect-error
      const $scrollWrapper: Element = scrollRef.value!.wrap;

      let firstTag = null;
      let lastTag = null;

      // find first tag and last tag
      if (tagList?.length > 0) {
        firstTag = tagList[0];
        lastTag = tagList[tagList.length - 1];
      }

      if (firstTag === currentTag) {
        $scrollWrapper.scrollLeft = 0;
      } else if (lastTag === currentTag) {
        $scrollWrapper.scrollLeft = $scrollWrapper.scrollWidth - $containerWidth;
      } else {
        // find preTag and nextTag
        const currentIndex = tagList.findIndex((item: Element) => item === currentTag);
        const prevTag = tagList[currentIndex - 1];
        const nextTag = tagList[currentIndex + 1];

        // the tag's offsetLeft after of nextTag
        const afterNextTagOffsetLeft = nextTag.$el.offsetLeft + nextTag.$el.offsetWidth + tagAndTagSpacing;

        // the tag's offsetLeft before of prevTag
        const beforePrevTagOffsetLeft = prevTag.$el.offsetLeft - tagAndTagSpacing;

        if (afterNextTagOffsetLeft > $scrollWrapper.scrollLeft + $containerWidth) {
          $scrollWrapper.scrollLeft = afterNextTagOffsetLeft - $containerWidth;
        } else if (beforePrevTagOffsetLeft < $scrollWrapper.scrollLeft) {
          $scrollWrapper.scrollLeft = beforePrevTagOffsetLeft;
        }
      }
    }
 })

    return () => (
      <el-scrollbar
        ref={scrollRef}
        class="scroll-container"
        onWheel={withModifiers(handleScroll, ["native", "prevent"])}
      >
        {slots.default?.()}
      </el-scrollbar>
    );
  },
});
