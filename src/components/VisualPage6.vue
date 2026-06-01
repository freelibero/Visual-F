<script setup lang="ts">
import * as echarts from "echarts";
import { ref, onMounted, onUnmounted } from "vue";

const chartRef = ref<HTMLDivElement>();
let chart: echarts.ECharts | null = null;

// ====== 医院年度预算数据（万元） ======
const budgetData = {
  name: "年度预算",
  children: [
    {
      name: "人员经费",
      children: [
        { name: "医生薪资", value: [820] },
        { name: "护理人员", value: [650] },
        { name: "行政管理", value: [280] },
        { name: "后勤保障", value: [180] },
      ],
    },
    {
      name: "医疗设备",
      children: [
        { name: "影像设备", value: [520] },
        { name: "手术器械", value: [380] },
        { name: "检验设备", value: [210] },
        { name: "监护仪器", value: [150] },
      ],
    },
    {
      name: "药品耗材",
      children: [
        { name: "西药采购", value: [680] },
        { name: "中成药", value: [240] },
        { name: "医用耗材", value: [350] },
        { name: "检验试剂", value: [190] },
      ],
    },
    {
      name: "基建运营",
      children: [
        { name: "楼宇维护", value: [300] },
        { name: "能源水电", value: [160] },
        { name: "信息系统", value: [120] },
      ],
    },
    {
      name: "科研教育",
      children: [
        { name: "课题研究", value: [150] },
        { name: "人员培训", value: [90] },
        { name: "学术交流", value: [60] },
      ],
    },
  ],
};

function formatMoney(v: number) {
  return v >= 10000 ? `${(v / 10000).toFixed(1)}亿` : `${v}万元`;
}

const option: echarts.EChartsOption = {
  tooltip: {
    backgroundColor: "rgba(10,30,50,0.95)",
    borderColor: "#00bcd4",
    textStyle: { color: "#fff", fontSize: 11 },
    formatter: (info: unknown) => {
      const item = info as { name: string; value: number[] };
      if (!item.value || item.value[0] == null) return item.name;
      return `${item.name}<br/>预算: <b>${formatMoney(item.value[0])}</b>`;
    },
  },
  series: [
    {
      type: "treemap",
      top: 20,
      bottom: 5,
      left: 5,
      right: 5,
      label: {
        show: true,
        position: "insideTopLeft",
        formatter: (p: unknown) => {
          const param = p as { name: string; value: number[] };
          if (!param.value || param.value[0] == null) return param.name;
          return `{name|${param.name}}\n{val|${formatMoney(param.value[0])}}`;
        },
        rich: {
          name: { fontSize: 10, color: "#fff" },
          val: { fontSize: 8, color: "#ffcc80", padding: [1, 0] },
        },
      },
      itemStyle: {
        borderColor: "rgba(10,20,40,0.9)",
        borderWidth: 2,
        gapWidth: 2,
      },
      levels: [
        {
          color: ["#c23531", "#5470c6", "#91cc75", "#fac858", "#ee6666"],
          colorMappingBy: "id",
          itemStyle: { gapWidth: 3, borderWidth: 3 },
        },
        {
          colorAlpha: [0.5, 1],
          itemStyle: { gapWidth: 1 },
        },
      ],
      data: budgetData.children,
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
  <dv-border-box1 :color="['#04c2f1', '#d2e0eeea']">
    <div ref="chartRef" class="chart-box"></div>
  </dv-border-box1>
</template>

<style scoped>
.chart-box {
  width: 97%;
  height: 170px;
  margin: 0 auto 0 auto;
}
</style>
