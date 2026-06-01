<script setup lang="ts">
import * as echarts from "echarts";
import { ref, onMounted, onUnmounted } from "vue";

const chartRef = ref<HTMLDivElement>();
let chart: echarts.ECharts | null = null;

// ====== 内科 / 外科 / 急诊 多维度指标 ======
// [门诊量, 住院数, 手术量, 床位使用率, 平均住院日, 患者满意度]
const deptInternal: number[][] = [
  [320,180,55,88,7.2,94], [340,195,60,92,6.8,95], [310,170,50,85,7.5,93],
  [360,210,65,90,6.5,96], [330,190,58,87,7.0,94], [318,185,54,86,7.3,95],
  [350,205,62,91,6.6,96], [325,178,52,84,7.6,92], [342,200,60,89,6.9,95],
  [355,208,63,90,6.7,96], [315,175,51,83,7.8,91], [338,192,57,88,7.1,94],
  [345,202,61,91,6.8,95], [330,188,55,87,7.2,93], [352,206,64,92,6.5,96],
  [320,180,53,86,7.4,94], [348,203,62,90,6.7,95], [328,186,56,87,7.1,93],
  [358,212,66,93,6.4,97], [335,192,58,88,7.0,94], [322,182,54,85,7.5,92],
];

const deptSurgical: number[][] = [
  [180,260,90,78,9.5,88], [190,275,95,80,9.2,89], [175,250,85,76,10.0,86],
  [195,280,98,82,9.0,90], [185,270,92,79,9.3,88], [178,255,87,77,9.8,87],
  [192,278,96,81,9.1,89], [182,258,88,77,9.6,87], [188,272,93,80,9.2,88],
  [196,282,99,83,8.9,90], [170,248,84,75,10.2,85], [186,268,91,79,9.4,88],
  [190,275,95,81,9.1,89], [184,265,89,78,9.5,87], [194,280,97,82,9.0,90],
  [180,260,88,77,9.7,86], [191,276,96,81,9.2,89], [183,262,87,78,9.6,87],
  [197,285,100,84,8.8,91], [187,270,92,80,9.3,88], [179,255,86,76,9.9,86],
];

const deptEmergency: number[][] = [
  [450,120,30,95,2.5,82], [470,125,32,96,2.3,83], [440,118,28,93,2.8,80],
  [480,130,34,97,2.1,84], [460,122,31,95,2.4,82], [445,115,28,92,2.9,80],
  [475,128,33,96,2.2,83], [455,120,30,94,2.6,81], [465,125,32,95,2.3,82],
  [485,132,35,98,2.0,85], [435,112,27,91,3.0,79], [460,122,31,95,2.5,81],
  [470,127,33,96,2.2,83], [450,120,30,94,2.6,82], [480,130,34,97,2.1,84],
  [455,118,29,93,2.7,80], [468,125,32,96,2.3,83], [448,119,29,93,2.7,81],
  [488,134,36,98,1.9,85], [462,124,31,95,2.4,82], [442,116,28,92,2.9,80],
];

const lineStyle = { width: 1, opacity: 0.4 };

const option: echarts.EChartsOption = {
  legend: {
    orient: "vertical",
    right: 5,
    top: "center",
    data: ["内科", "外科", "急诊"],
    itemGap: 12,
    textStyle: { color: "#8ab4d6", fontSize: 11 },
    selectedMode: "single",
  },
  radar: {
    indicator: [
      { name: "门诊量", max: 500 },
      { name: "住院数", max: 300 },
      { name: "手术量", max: 100 },
      { name: "床位率", max: 100 },
      { name: "住院日", max: 12 },
      { name: "满意度", max: 100 },
    ],
    center: ["42%", "54%"],
    radius: "58%",
    shape: "circle",
    splitNumber: 4,
    axisName: { color: "rgb(238, 197, 102)", fontSize: 10 },
    splitLine: {
      lineStyle: {
        color: [
          "rgba(238,197,102,0.1)", "rgba(238,197,102,0.2)",
          "rgba(238,197,102,0.4)", "rgba(238,197,102,0.6)",
          "rgba(238,197,102,0.8)",
        ].reverse(),
      },
    },
    splitArea: { show: false },
    axisLine: { lineStyle: { color: "rgba(238,197,102,0.5)" } },
  },
  series: [
    {
      name: "内科",
      type: "radar",
      lineStyle,
      data: deptInternal,
      symbol: "none",
      itemStyle: { color: "#F9713C" },
      areaStyle: { opacity: 0.1 },
    },
    {
      name: "外科",
      type: "radar",
      lineStyle,
      data: deptSurgical,
      symbol: "none",
      itemStyle: { color: "#B3E4A1" },
      areaStyle: { opacity: 0.05 },
    },
    {
      name: "急诊",
      type: "radar",
      lineStyle,
      data: deptEmergency,
      symbol: "none",
      itemStyle: { color: "rgb(238, 197, 102)" },
      areaStyle: { opacity: 0.05 },
    },
  ],
};

let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
  if (!chartRef.value) return;
  chart = echarts.init(chartRef.value);
  chart.setOption(option);

  resizeObserver = new ResizeObserver(() => chart?.resize());
  resizeObserver.observe(chartRef.value);
});

onUnmounted(() => {
  resizeObserver?.disconnect();
  chart?.dispose();
});
</script>

<template>
  <dv-border-box1 :style="{ width: '417px', height: '212px' }" :color="['#04c2f1', '#d2e0eeea']">
    <div ref="chartRef" class="chart-box" />
  </dv-border-box1>
</template>

<style scoped>
.chart-box {
  width: 100%;
  height: 205px;
}
</style>
