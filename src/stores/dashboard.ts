import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useDashboard = defineStore("dashboard", () => {
  // ====== 全局状态 ======
  const selectedDept = ref<string | null>(null);    // 选中的科室
  const dataVersion = ref(0);                       // 数据版本，触发联动刷新
  const loading = ref(false);                       // 加载态
  const lastUpdate = ref(new Date());               // 最后刷新时间
  const animReady = ref(false);                     // 入场动画开关

  // ====== 门诊-住院-急诊趋势数据 ======
  function generateTrendData() {
    const oneDay = 24 * 3600 * 1000;
    const base = +new Date(2020, 0, 1);
    const dates: string[] = [];
    const op: number[] = [];
    const ip: number[] = [];
    const em: number[] = [];
    let o = 300, i = 120, e = 80;
    for (let j = 0; j < 2000; j++) {
      const d = new Date(base + j * oneDay);
      dates.push([d.getFullYear(), d.getMonth() + 1, d.getDate()].join("/"));
      o = Math.round((Math.random() - 0.5) * 60 + o);
      i = Math.round((Math.random() - 0.5) * 25 + i);
      e = Math.round((Math.random() - 0.5) * 20 + e);
      op.push(o); ip.push(i); em.push(e);
    }
    return { dates, outpatient: op, inpatient: i, emergency: e };
  }

  // ====== 科室柱状图数据 ======
  const deptBarData = computed(() => ({
    departments: ["内科", "外科", "儿科", "妇产科", "急诊科", "骨科", "神经科"],
    outpatient: [520, 432, 401, 334, 590, 430, 320],
    scheduled: [120, 132, 101, 134, 90, 230, 110],
    emergencyIn: [80, 92, 71, 104, 160, 120, 90],
    daySurgery: [50, 62, 51, 74, 90, 80, 60],
    surgery: [82, 98, 64, 76, 99, 120, 70],
  }));

  // ====== 床位数据 ======
  const bedData = computed(() => ({
    total: 680,
    used: 578,
    depts: [
      { name: "ICU", used: 28, total: 32, alert: true },
      { name: "心内科", used: 45, total: 52, alert: false },
      { name: "骨科", used: 38, total: 48, alert: false },
      { name: "妇产科", used: 22, total: 35, alert: false },
      { name: "儿科", used: 18, total: 30, alert: false },
    ],
  }));

  // ====== KPI 指标 ======
  const kpiData = computed(() => ({
    today: [
      { key: "门诊人次", val: 1286, prev: 1192 },
      { key: "入院患者", val: 47, prev: 43 },
      { key: "手术台次", val: 23, prev: 26 },
      { key: "检查量", val: 312, prev: 298 },
    ],
    lastUpdate: lastUpdate.value,
  }));

  // ====== 饼图 ======
  const pieData = computed(() => ({
    outpatient: [
      { name: "内科", value: 320 },
      { name: "外科", value: 220 },
      { name: "儿科", value: 190 },
      { name: "妇产科", value: 160 },
      { name: "急诊科", value: 280 },
    ],
    inpatient: [
      { name: "内科", value: 180 },
      { name: "外科", value: 250 },
      { name: "儿科", value: 110 },
      { name: "妇产科", value: 200 },
      { name: "急诊科", value: 140 },
    ],
  }));

  // ====== 值班表 ======
  const rosterData = {
    days: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
    depts: ["心内科", "神经内科", "急诊科", "骨科", "儿科", "妇产科", "呼吸科"],
  };

  // ====== 设备完好率 + 排队 ======
  const deviceData = computed(() => ({
    healthRate: 94.6,
    queues: [
      { name: "CT室", count: 18 },
      { name: "MRI室", count: 14 },
      { name: "X光室", count: 22 },
      { name: "超声室", count: 16 },
      { name: "内镜室", count: 9 },
    ],
  }));

  // ====== 雷达图数据 ======
  const radarData = computed(() => ({
    indicators: [
      { name: "门诊量", max: 500 },
      { name: "住院数", max: 300 },
      { name: "手术量", max: 100 },
      { name: "床位率", max: 100 },
      { name: "住院日", max: 12 },
      { name: "满意度", max: 100 },
    ],
  }));

  // ====== 候诊列表 ======
  const waitingList = computed(() => [
    { id: "1", name: "张伟", dept: "心内科", status: "候诊中" as const },
    { id: "2", name: "李芳", dept: "神经内科", status: "候诊中" as const },
    { id: "3", name: "王建国", dept: "内分泌科", status: "叫号中" as const },
    { id: "4", name: "赵敏", dept: "心内科", status: "候诊中" as const },
    { id: "5", name: "刘洋", dept: "呼吸科", status: "候诊中" as const },
    { id: "6", name: "陈静", dept: "消化科", status: "已过号" as const },
    { id: "7", name: "杨磊", dept: "骨科", status: "候诊中" as const },
    { id: "8", name: "周婷", dept: "心内科", status: "候诊中" as const },
    { id: "9", name: "吴昊", dept: "神经内科", status: "叫号中" as const },
    { id: "10", name: "许慧", dept: "内分泌科", status: "候诊中" as const },
    { id: "11", name: "何强", dept: "呼吸科", status: "候诊中" as const },
    { id: "12", name: "宋丽", dept: "骨科", status: "候诊中" as const },
  ]);

  // ====== 预算树图 ======
  const budgetTreeData = {
    name: "年度预算",
    children: [
      { name: "人员经费", children: [
        { name: "医生薪资", value: [820] }, { name: "护理人员", value: [650] },
        { name: "行政管理", value: [280] }, { name: "后勤保障", value: [180] },
      ]},
      { name: "医疗设备", children: [
        { name: "影像设备", value: [520] }, { name: "手术器械", value: [380] },
        { name: "检验设备", value: [210] }, { name: "监护仪器", value: [150] },
      ]},
      { name: "药品耗材", children: [
        { name: "西药采购", value: [680] }, { name: "中成药", value: [240] },
        { name: "医用耗材", value: [350] }, { name: "检验试剂", value: [190] },
      ]},
      { name: "基建运营", children: [
        { name: "楼宇维护", value: [300] }, { name: "能源水电", value: [160] },
        { name: "信息系统", value: [120] },
      ]},
      { name: "科研教育", children: [
        { name: "课题研究", value: [150] }, { name: "人员培训", value: [90] },
        { name: "学术交流", value: [60] },
      ]},
    ],
  };

  // ====== Actions ======
  function selectDept(dept: string | null) {
    selectedDept.value = dept;
  }

  function refreshAll() {
    dataVersion.value++;
    lastUpdate.value = new Date();
  }

  return {
    selectedDept, dataVersion, loading, lastUpdate, animReady,
    generateTrendData,
    deptBarData, bedData, kpiData, pieData,
    rosterData, deviceData, radarData, waitingList, budgetTreeData,
    selectDept, refreshAll,
  };
});
