<script setup lang="ts">
import * as echarts from "echarts";
import { ref, onMounted, onUnmounted } from "vue";

const gaugeRef = ref<HTMLDivElement>();
const barRef = ref<HTMLDivElement>();
let gaugeChart: echarts.ECharts | null = null;
let barChart: echarts.ECharts | null = null;

const gaugeOption: echarts.EChartsOption = {
  series: [
    {
      type: "gauge",
      startAngle: 200,
      endAngle: -20,
      center: ["50%", "58%"],
      radius: "85%",
      min: 0,
      max: 100,
      splitNumber: 10,
      axisLine: {
        lineStyle: {
          width: 12,
          color: [
            [0.3, "#ee6666"],
            [0.7, "#fac858"],
            [1, "#91cc75"],
          ],
        },
      },
      pointer: {
        icon: "path://M12.8,0.7l12,40.1H0.7L12.8,0.7z",
        length: "60%",
        width: 6,
        itemStyle: { color: "auto" },
      },
      axisTick: {
        length: 8,
        lineStyle: { color: "auto", width: 1 },
      },
      splitLine: {
        length: 20,
        lineStyle: { color: "auto", width: 3 },
      },
      axisLabel: {
        color: "#6a9ab5",
        fontSize: 10,
        distance: 20,
      },
      detail: {
        valueAnimation: true,
        formatter: "{value}%",
        color: "#00e5ff",
        fontSize: 22,
        offsetCenter: [0, "60%"],
      },
      data: [{ value: 94.6 }],
    },
  ],
};

const barOption: echarts.EChartsOption = {
  grid: { left: 50, right: 10, top: 5, bottom: 5 },
  xAxis: {
    type: "value",
    show: false,
    min: 0,
    max: 30,
  },
  yAxis: {
    type: "category",
    data: ["CT室", "MRI室", "X光室", "超声室", "内镜室"],
    axisLabel: { color: "#8ab4d6", fontSize: 10 },
    axisLine: { show: false },
    axisTick: { show: false },
  },
  series: [
    {
      type: "bar",
      data: [18, 14, 22, 16, 9],
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
          { offset: 0, color: "#00bcd4" },
          { offset: 1, color: "#00e5ff" },
        ]),
        borderRadius: [0, 3, 3, 0],
      },
      barWidth: 10,
      label: {
        show: true,
        position: "right",
        color: "#6a9ab5",
        fontSize: 10,
        formatter: "{c}人",
      },
    },
  ],
};

let ro1: ResizeObserver | null = null;
let ro2: ResizeObserver | null = null;

onMounted(() => {
  if (gaugeRef.value) {
    gaugeChart = echarts.init(gaugeRef.value);
    gaugeChart.setOption(gaugeOption);
    ro1 = new ResizeObserver(() => gaugeChart?.resize());
    ro1.observe(gaugeRef.value);
  }
  if (barRef.value) {
    barChart = echarts.init(barRef.value);
    barChart.setOption(barOption);
    ro2 = new ResizeObserver(() => barChart?.resize());
    ro2.observe(barRef.value);
  }
});

onUnmounted(() => {
  ro1?.disconnect();
  ro2?.disconnect();
  gaugeChart?.dispose();
  barChart?.dispose();
});
</script>

<template>
  <dv-border-box1 :style="{ width: '417px', height: '212px' }" :color="['#04c2f1', '#d2e0eeea']">
    <div class="dual-panel">
      <div class="dual-left">
        <div class="panel-subtitle">设备完好率</div>
        <div ref="gaugeRef" class="gauge-box" />
      </div>
      <div class="dual-right">
        <div class="panel-subtitle">检查排队</div>
        <div ref="barRef" class="bar-box" />
      </div>
    </div>
  </dv-border-box1>
</template>

<style scoped>
.dual-panel {
  display: flex;
  height: 205px;
  padding: 6px 8px;
  gap: 4px;
}

.dual-left, .dual-right {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.panel-subtitle {
  color: #8ab4d6;
  font-size: 11px;
  text-align: center;
  margin-top: 2px;
  flex-shrink: 0;
}

.gauge-box {
  flex: 1;
  height: 0;
}

.bar-box {
  flex: 1;
  height: 0;
}
</style>
