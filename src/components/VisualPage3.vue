<script setup lang="ts">
import * as echarts from "echarts";
import { ref, onMounted, onUnmounted } from "vue";

const chartRef = ref<HTMLDivElement>();
let chart: echarts.ECharts | null = null;

// ====== 日间门诊量数据（含午休时段） ======
const formatTime = (t: number) => {
  const d = new Date(t);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

const dayStart = +new Date("2025-06-01T08:00:00");
const dayEnd = +new Date("2025-06-01T17:00:00");
const breakStart = +new Date("2025-06-01T12:00:00");
const breakEnd = +new Date("2025-06-01T13:00:00");

const seriesData: [number, number][] = [];
let val = 40;
let time = dayStart;

while (time <= dayEnd) {
  if (time <= breakStart || time >= breakEnd) {
    // 上午和下午就诊高峰，午休时段无数据
    const hour = new Date(time).getHours();
    const peakFactor = hour < 10 ? 1.5 : hour < 12 ? 1 : hour < 15 ? 1.3 : 0.7;
    val = Math.max(5, val + Math.round((Math.random() - 0.5) * 15 * peakFactor));
    seriesData.push([time, val]);
  }
  time += 5 * 60 * 1000; // 每5分钟
}

const option: echarts.EChartsOption = {
  useUTC: false,
  tooltip: {
    show: true,
    trigger: "axis",
    backgroundColor: "rgba(10,30,50,0.95)",
    borderColor: "#00bcd4",
    textStyle: { color: "#fff", fontSize: 11 },
    formatter: (p: unknown) => {
      const item = (p as { value: number[] }[])[0]!;
      return `时间: ${formatTime(item.value[0]!)}<br/>当前候诊: <b>${item.value[1]}</b> 人`;
    },
  },
  title: {
    text: "日间门诊实时流量",
    left: "center",
    top: 2,
    textStyle: { color: "#8ab4d6", fontSize: 14 },
  },
  grid: { left: 40, right: 15, top: 35, bottom: 30 },
  xAxis: {
    type: "time",
    interval: 1000 * 60 * 60,
    axisLabel: {
      color: "#6a9ab5",
      fontSize: 10,
      formatter: (value: unknown) => formatTime(value as number),
    },
    axisLine: { lineStyle: { color: "#2a4a6a" } },
    breaks: [{ start: breakStart, end: breakEnd, gap: 0 }],
    breakArea: {
      expandOnClick: false,
      zigzagAmplitude: 0,
      zigzagZ: 200,
    },
  },
  yAxis: {
    type: "value",
    name: "候诊人数",
    nameTextStyle: { color: "#6a9ab5", fontSize: 10 },
    axisLabel: { color: "#6a9ab5", fontSize: 10 },
    splitLine: { lineStyle: { color: "rgba(42,74,106,0.3)" } },
    min: "dataMin",
  },
  series: [
    {
      type: "line",
      symbolSize: 0,
      lineStyle: { color: "#fac858", width: 1.5 },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: "rgba(250,200,88,0.4)" },
          { offset: 1, color: "rgba(250,200,88,0.05)" },
        ]),
      },
      data: seriesData,
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
    <div ref="chartRef" class="chart-box"></div>
  </dv-border-box1>
</template>

<style scoped>
.chart-box {
  width: 100%;
  height: 205px;
}
</style>
