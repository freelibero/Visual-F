<script setup lang="ts">
import * as echarts from "echarts";
import { ref, onMounted, onUnmounted } from "vue";

const chartRef = ref<HTMLDivElement>();
let chart: echarts.ECharts | null = null;

// ====== 生成每日门诊/住院/急诊数据 ======
const oneDay = 24 * 3600 * 1000;
const baseDate = +new Date(2020, 0, 1);
const dates: string[] = [];
const outpatient: number[] = [];
const inpatient: number[] = [];
const emergency: number[] = [];

let op = 300, ip = 120, em = 80;
for (let i = 0; i < 2000; i++) {
  const d = new Date(baseDate + i * oneDay);
  dates.push([d.getFullYear(), d.getMonth() + 1, d.getDate()].join("/"));
  op = Math.round((Math.random() - 0.5) * 60 + op);
  ip = Math.round((Math.random() - 0.5) * 25 + ip);
  em = Math.round((Math.random() - 0.5) * 20 + em);
  outpatient.push(op);
  inpatient.push(ip);
  emergency.push(em);
}

// 计算均值
const avgOP = Math.round(outpatient.reduce((a, b) => a + b, 0) / outpatient.length);
const avgIP = Math.round(inpatient.reduce((a, b) => a + b, 0) / inpatient.length);

const option: echarts.EChartsOption = {
  color: ["#ff6e40", "#00bcd4", "#ffca28"],
  tooltip: {
    trigger: "axis",
    backgroundColor: "rgba(10,30,50,0.95)",
    borderColor: "#00bcd4",
    textStyle: { color: "#fff", fontSize: 12 },
    formatter: (params) => {
      if (!Array.isArray(params)) return "";
      const date = params[0]?.name ?? "";
      let html = `<b>${date}</b><br/>`;
      params.forEach((p) => {
        const color = typeof p.color === "string" ? p.color : "#fff";
        html += `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${color};margin-right:4px;"></span>${p.seriesName}: <b>${p.value}</b> 人次<br/>`;
      });
      return html;
    },
  },
  title: {
    left: "center",
    text: "医院运营趋势总览",
    textStyle: { color: "#b0e0ff", fontSize: 16 },
    top: 4,
  },
  legend: {
    top: 26,
    left: "center",
    textStyle: { color: "#8ab4d6", fontSize: 11 },
    itemWidth: 16,
    itemHeight: 2,
  },
  toolbox: {
    right: 10,
    top: 5,
    feature: {
      dataZoom: { yAxisIndex: "none", title: { zoom: "区域缩放", back: "还原" } },
      restore: { title: "还原" },
      saveAsImage: { title: "保存" },
    },
    iconStyle: { borderColor: "#6a9ab5" },
  },
  grid: { left: 60, right: 30, top: 70, bottom: 45 },
  xAxis: {
    type: "category",
    boundaryGap: false,
    data: dates,
    axisLine: { lineStyle: { color: "#2a4a6a" } },
    axisLabel: { color: "#6a9ab5", fontSize: 10 },
    splitLine: { show: false },
  },
  yAxis: {
    type: "value",
    name: "人次",
    nameTextStyle: { color: "#6a9ab5" },
    axisLabel: { color: "#6a9ab5" },
    splitLine: { lineStyle: { color: "rgba(42,74,106,0.3)" } },
  },
  dataZoom: [
    { type: "inside", start: 0, end: 10 },
    {
      start: 0, end: 10,
      borderColor: "#2a4a6a",
      backgroundColor: "rgba(10,20,40,0.6)",
      fillerColor: "rgba(0,188,212,0.12)",
      dataBackground: {
        lineStyle: { color: "#4a8aba" },
        areaStyle: { color: "rgba(74,138,186,0.15)" },
      },
    },
  ],
  series: [
    {
      name: "门诊",
      type: "line",
      symbol: "none",
      sampling: "lttb",
      lineStyle: { width: 2.5 },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: "rgba(255,110,64,0.45)" },
          { offset: 1, color: "rgba(255,110,64,0.02)" },
        ]),
      },
      data: outpatient,
      markLine: {
        silent: true,
        symbol: "none",
        lineStyle: { type: "dashed", color: "rgba(255,110,64,0.4)", width: 1 },
        label: { color: "#ff6e40", fontSize: 10, formatter: `门诊均值\n${avgOP}` },
        data: [{ yAxis: avgOP }],
      },
    },
    {
      name: "住院",
      type: "line",
      symbol: "none",
      sampling: "lttb",
      lineStyle: { width: 2 },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: "rgba(0,188,212,0.35)" },
          { offset: 1, color: "rgba(0,188,212,0.02)" },
        ]),
      },
      data: inpatient,
      markLine: {
        silent: true,
        symbol: "none",
        lineStyle: { type: "dashed", color: "rgba(0,188,212,0.4)", width: 1 },
        label: { color: "#00bcd4", fontSize: 10, formatter: `住院均值\n${avgIP}` },
        data: [{ yAxis: avgIP }],
      },
    },
    {
      name: "急诊",
      type: "line",
      symbol: "none",
      sampling: "lttb",
      lineStyle: { width: 1.5, type: "solid" },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: "rgba(255,202,40,0.2)" },
          { offset: 1, color: "rgba(255,202,40,0.01)" },
        ]),
      },
      data: emergency,
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
  <div ref="chartRef" class="midrange-chart"></div>
</template>

<style scoped>
.midrange-chart {
  width: 100%;
  height: 100%;
}
</style>
