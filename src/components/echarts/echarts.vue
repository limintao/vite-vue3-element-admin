<template>
  <div ref="echarts" class="echarts-container"></div>
</template>

<script>
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from "echarts/core";
// 引入柱状图图表，图表后缀都为 Chart
import { BarChart, LineChart } from "echarts/charts";
// 引入提示框，标题，直角坐标系组件，组件后缀都为 Component
import {
  TitleComponent,
  TooltipComponent,
  ToolboxComponent,
  GridComponent,
  LegendComponent,
  MarkPointComponent,
  MarkLineComponent,
} from "echarts/components";
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from "echarts/renderers";
// 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  ToolboxComponent,
  GridComponent,
  BarChart,
  CanvasRenderer,
  LineChart,
  LegendComponent,
  MarkPointComponent,
  MarkLineComponent,
]);

export default {
  name: "echartsComp",
  props: {
    options: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
  data() {
    return {
      myChart:{}
    };
  },
  mounted() {
    this.drawLine();
  },
  methods: {
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      this.myChart = echarts.init(this.$refs.echarts);
      // 绘制图表
      this.myChart.setOption(this.options);
    },
  },
};
</script>

<style lang="scss" scoped>
.echarts-container {
  width: 100%;
  height: 100%;
}
</style>