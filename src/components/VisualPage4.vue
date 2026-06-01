<script setup lang="ts">
import * as echarts from "echarts";
import { ref, onMounted, onUnmounted } from "vue";

const chartRef = ref<HTMLDivElement>();
let chart: echarts.ECharts | null = null;

const outpatientData = [
  { name: "内科", value: 320 },
  { name: "外科", value: 220 },
  { name: "儿科", value: 190 },
  { name: "妇产科", value: 160 },
  { name: "急诊科", value: 280 },
];

const inpatientData = [
  { name: "内科", value: 180 },
  { name: "外科", value: 250 },
  { name: "儿科", value: 110 },
  { name: "妇产科", value: 200 },
  { name: "急诊科", value: 140 },
];

const option: echarts.EChartsOption = {
  tooltip: {
    trigger: "item",
    backgroundColor: "rgba(10,30,50,0.9)",
    borderColor: "#00bcd4",
    textStyle: { color: "#fff", fontSize: 11 },
    formatter: (p: unknown) => {
      const item = p as { seriesName: string; name: string; value: number; percent: number };
      return `${item.seriesName}<br/>${item.name}: ${item.value} 人 (${item.percent}%)`;
    },
  },
  title: [
    { text: "门诊", left: "24%", top: 4, textStyle: { color: "#8ab4d6", fontSize: 13 } },
    { text: "住院", left: "72%", top: 4, textStyle: { color: "#8ab4d6", fontSize: 13 } },
  ],
  legend: {
    bottom: 2,
    textStyle: { color: "#8ab4d6", fontSize: 10 },
    itemWidth: 10,
    itemHeight: 8,
  },
  series: [
    {
      name: "门诊",
      type: "pie",
      radius: "55%",
      center: ["25%", "55%"],
      data: outpatientData,
      label: {
        color: "#8ab4d6",
        fontSize: 9,
        formatter: "{b}\n{d}%",
      },
      itemStyle: { borderColor: "rgba(10,20,40,0.8)", borderWidth: 2 },
      emphasis: {
        itemStyle: { shadowBlur: 8, shadowColor: "rgba(0,0,0,0.5)" },
      },
    },
    {
      name: "住院",
      type: "pie",
      radius: "55%",
      center: ["75%", "55%"],
      data: inpatientData,
      label: {
        color: "#8ab4d6",
        fontSize: 9,
        formatter: "{b}\n{d}%",
      },
      itemStyle: { borderColor: "rgba(10,20,40,0.8)", borderWidth: 2 },
      emphasis: {
        itemStyle: { shadowBlur: 8, shadowColor: "rgba(0,0,0,0.5)" },
      },
    },
  ],
  color: ["#5470c6", "#91cc75", "#fac858", "#ee6666", "#73c0de"],
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
  <dv-border-box1 :color="['#04c2f1', '#d2e0eeea']">
    <div ref="chartRef" class="chart-box"></div>
  </dv-border-box1>
</template>

<style scoped>
.chart-box {
  width: 100%;
  height: 175px;
}
</style>
