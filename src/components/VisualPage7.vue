<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

interface PatientRow {
  id: string;
  name: string;
  dept: string;
  status: "候诊中" | "叫号中" | "已过号";
}

const rows: PatientRow[] = [
  { id: "1", name: "张伟", dept: "心内科", status: "候诊中" },
  { id: "2", name: "李芳", dept: "神经内科", status: "候诊中" },
  { id: "3", name: "王建国", dept: "内分泌科", status: "叫号中" },
  { id: "4", name: "赵敏", dept: "心内科", status: "候诊中" },
  { id: "5", name: "刘洋", dept: "呼吸科", status: "候诊中" },
  { id: "6", name: "陈静", dept: "消化科", status: "已过号" },
  { id: "7", name: "杨磊", dept: "骨科", status: "候诊中" },
  { id: "8", name: "周婷", dept: "心内科", status: "候诊中" },
  { id: "9", name: "吴昊", dept: "神经内科", status: "叫号中" },
  { id: "10", name: "许慧", dept: "内分泌科", status: "候诊中" },
  { id: "11", name: "何强", dept: "呼吸科", status: "候诊中" },
  { id: "12", name: "宋丽", dept: "骨科", status: "候诊中" },
];

const statusClass = (status: string) => {
  if (status === "叫号中") return "status-calling";
  if (status === "已过号") return "status-missed";
  return "status-waiting";
};

const scrollRef = ref<HTMLDivElement>();
let timer: ReturnType<typeof setInterval>;

onMounted(() => {
  timer = setInterval(() => {
    if (!scrollRef.value) return;
    const row = scrollRef.value.querySelector(".patient-row") as HTMLElement | null;
    if (row) {
      scrollRef.value.scrollTop += row.offsetHeight + 2;
      if (
        scrollRef.value.scrollTop >=
        scrollRef.value.scrollHeight - scrollRef.value.clientHeight
      ) {
        scrollRef.value.scrollTop = 0;
      }
    }
  }, 3000);
});

onUnmounted(() => {
  clearInterval(timer);
});
</script>

<template>
  <dv-border-box1 :color="['#04c2f1', '#d2e0eeea']">
    <div class="scroll-wrap">
      <div class="table-header">
        <span class="col-id">序号</span>
        <span class="col-name">患者姓名</span>
        <span class="col-dept">科室</span>
        <span class="col-status">候诊状态</span>
      </div>
      <div ref="scrollRef" class="table-body">
        <div
          v-for="(row, i) in rows"
          :key="row.id"
          class="patient-row"
          :class="i % 2 === 0 ? 'row-even' : 'row-odd'"
        >
          <span class="col-id">{{ row.id }}</span>
          <span class="col-name">{{ row.name }}</span>
          <span class="col-dept">{{ row.dept }}</span>
          <span class="col-status" :class="statusClass(row.status)">{{ row.status }}</span>
        </div>
      </div>
    </div>
  </dv-border-box1>
</template>

<style scoped>
.scroll-wrap {
  width: 100%;
  height: 200px;
  padding: 6px 4px 0 4px;
  display: flex;
  flex-direction: column;
  font-size: 13px;
  color: #d0e0f0;
}

.table-header {
  display: flex;
  background: #0a2a4a;
  height: 34px;
  line-height: 34px;
  font-weight: bold;
  flex-shrink: 0;
  border-radius: 2px;
}

.table-body {
  flex: 1;
  overflow: hidden;
  scroll-behavior: smooth;
}

.patient-row {
  display: flex;
  height: 28px;
  line-height: 28px;
  margin-top: 2px;
  border-radius: 2px;
}

.row-odd {
  background: rgba(10, 30, 60, 0.5);
}

.row-even {
  background: rgba(20, 50, 90, 0.3);
}

.col-id {
  width: 15%;
  text-align: center;
}

.col-name {
  width: 30%;
  text-align: center;
}

.col-dept {
  width: 28%;
  text-align: center;
}

.col-status {
  width: 27%;
  text-align: center;
  font-weight: bold;
}

.status-waiting {
  color: #91cc75;
}

.status-calling {
  color: #fac858;
}

.status-missed {
  color: #ee6666;
}
</style>
