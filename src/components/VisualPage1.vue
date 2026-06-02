<script setup lang="ts">
import * as echarts from "echarts";
import { ref, onMounted, onUnmounted, watch } from "vue";
import { useDashboard } from "@/stores/dashboard";

const store = useDashboard();
const chartRef = ref<HTMLDivElement>();
let chart: echarts.ECharts | null = null;

const depts = store.deptBarData.departments;

const option: echarts.EChartsOption = {
  tooltip: {
    trigger: "axis",
    axisPointer: { type: "shadow" },
    backgroundColor: "rgba(10,30,50,0.9)",
    borderColor: "#00bcd4",
    textStyle: { color: "#fff", fontSize: 12 },
  },
  legend: {
    textStyle: { color: "#8ab4d6", fontSize: 10 },
    top: 0,
    itemWidth: 10,
    itemHeight: 8,
  },
  grid: {
    left: 45,
    right: 10,
    top: 35,
    bottom: 25,
  },
  xAxis: [
    {
      type: "category",
      data: ["内科", "外科", "儿科", "妇产科", "急诊科", "骨科", "神经科"],
      axisLabel: { color: "#8ab4d6", fontSize: 10 },
      axisLine: { lineStyle: { color: "#2a4a6a" } },
      axisTick: { show: false },
    },
  ],
  yAxis: [
    {
      type: "value",
      name: "人次",
      nameTextStyle: { color: "#6a9ab5", fontSize: 10 },
      axisLabel: { color: "#6a9ab5", fontSize: 10 },
      splitLine: { lineStyle: { color: "rgba(42,74,106,0.3)" } },
    },
  ],
  series: [
    {
      name: "门诊量",
      type: "bar",
      emphasis: { focus: "series" },
      itemStyle: { color: "#5470c6" },
      data: [520, 432, 401, 334, 590, 430, 320],
    },
    {
      name: "择期住院",
      type: "bar",
      stack: "住院",
      emphasis: { focus: "series" },
      itemStyle: { color: "#91cc75" },
      data: [120, 132, 101, 134, 90, 230, 110],
    },
    {
      name: "急诊住院",
      type: "bar",
      stack: "住院",
      emphasis: { focus: "series" },
      itemStyle: { color: "#ee6666" },
      data: [80, 92, 71, 104, 160, 120, 90],
    },
    {
      name: "日间住院",
      type: "bar",
      stack: "住院",
      emphasis: { focus: "series" },
      itemStyle: { color: "#fac858" },
      data: [50, 62, 51, 74, 90, 80, 60],
    },
    {
      name: "手术台数",
      type: "bar",
      emphasis: { focus: "series" },
      itemStyle: { color: "#3ba272" },
      data: [82, 98, 64, 76, 99, 120, 70],
      markLine: {
        lineStyle: { type: "dashed", color: "#fc8452" },
        data: [[{ type: "min" }, { type: "max" }]],
        label: { color: "#fc8452", fontSize: 10 },
      },
    },
    {
      name: "择期手术",
      type: "bar",
      barWidth: 5,
      stack: "手术分类",
      emphasis: { focus: "series" },
      itemStyle: { color: "#5470c6" },
      data: [45, 58, 35, 40, 55, 72, 38],
    },
    {
      name: "急诊手术",
      type: "bar",
      stack: "手术分类",
      emphasis: { focus: "series" },
      itemStyle: { color: "#ee6666" },
      data: [18, 15, 12, 16, 22, 25, 15],
    },
    {
      name: "微创手术",
      type: "bar",
      stack: "手术分类",
      emphasis: { focus: "series" },
      itemStyle: { color: "#91cc75" },
      data: [12, 15, 10, 11, 13, 15, 10],
    },
    {
      name: "其他手术",
      type: "bar",
      stack: "手术分类",
      emphasis: { focus: "series" },
      itemStyle: { color: "#73c0de" },
      data: [7, 10, 7, 9, 9, 8, 7],
    },
  ],
};

let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
  if (!chartRef.value) return;
  chart = echarts.init(chartRef.value);
  chart.setOption(option);

  // 点击科室 → 全局联动
  chart.on("click", (params: { name?: string }) => {
    if (params.name) {
      store.selectDept(store.selectedDept === params.name ? null : params.name);
    }
  });

  resizeObserver = new ResizeObserver(() => chart?.resize());
  resizeObserver.observe(chartRef.value);
});

// 联动高亮
watch(() => store.selectedDept, (dept) => {
  chart?.dispatchAction({ type: "downplay", seriesIndex: 0 });
  if (dept) {
    for (let i = 0; i < depts.length; i++) {
      if (depts[i] === dept) {
        chart?.dispatchAction({ type: "highlight", seriesIndex: 0, dataIndex: i });
      }
    }
  }
});

onUnmounted(() => {
  resizeObserver?.disconnect();
  chart?.dispose();
});
</script>

<template>
  <dv-border-box1 :color="['#04c2f1', '#d2e0eeea']">
    <div ref="chartRef" class="chart-box"></div>
  </dv-border-box1>
</template>

<style scoped>
.chart-box {
  width: 100%;
  height: 200px;
  padding-top: 8px;
}
</style>
