<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useDashboard } from "@/stores/dashboard";

const store = useDashboard();
const total = store.bedData.total;
const used = ref(0);
const target = store.bedData.used;
const depts = store.bedData.depts;

// 数字滚动动画
onMounted(() => {
  let c = 0;
  const step = Math.ceil(target / 40);
  const timer = setInterval(() => {
    c += step;
    if (c >= target) { c = target; clearInterval(timer); }
    used.value = c;
  }, 30);
});

const rateStyle = (u: number, t: number) => {
  const r = Math.round((u / t) * 100);
  if (r >= 85) return { bg: "linear-gradient(135deg, #ee6666, #fc8452)", shadow: "0 0 12px rgba(238,102,102,0.35)" };
  if (r >= 70) return { bg: "linear-gradient(135deg, #fac858, #ee6666)", shadow: "0 0 12px rgba(250,200,88,0.3)" };
  return { bg: "linear-gradient(135deg, #2a6a8a, #5470c6)", shadow: "0 0 8px rgba(84,112,198,0.25)" };
};
</script>

<template>
  <dv-border-box1 :style="{ width: '417px', height: '212px' }" :color="['#04c2f1', '#d2e0eeea']">
    <div class="bed-dashboard">
      <!-- 环形总览 -->
      <div class="gauge-col">
        <div class="gauge-outer">
          <div class="gauge-inner">
            <span class="gauge-num">{{ used }}</span>
            <span class="gauge-unit">/ {{ total }}</span>
          </div>
          <svg class="gauge-svg" viewBox="0 0 130 130">
            <defs>
              <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#00bcd4" />
                <stop offset="100%" stop-color="#00e5ff" />
              </linearGradient>
            </defs>
            <circle cx="65" cy="65" r="58" fill="none" stroke="#0f2238" stroke-width="6" />
            <circle cx="65" cy="65" r="58" fill="none" stroke="url(#gaugeGrad)"
              stroke-width="6" stroke-linecap="round" stroke-dasharray="364"
              :stroke-dashoffset="364 - 364 * (used / total)"
              transform="rotate(-90 65 65)"
              :style="{ filter: 'drop-shadow(0 0 8px rgba(0,188,212,0.4))' }"
            />
          </svg>
        </div>
        <div class="gauge-label">已用床位</div>
      </div>

      <!-- 科室列表 -->
      <div class="dept-col">
        <div v-for="d in depts" :key="d.name" class="dept-card">
          <div class="dept-top">
            <span class="dept-name">
              <span v-if="d.alert" class="dept-dot" />{{ d.name }}
            </span>
            <span class="dept-val">{{ d.used }}<span class="dept-sub">/{{ d.total }}</span></span>
          </div>
          <div class="dept-track">
            <div class="dept-fill" :style="{
              width: (d.used / d.total) * 100 + '%',
              background: rateStyle(d.used, d.total).bg,
              boxShadow: rateStyle(d.used, d.total).shadow,
            }" />
          </div>
        </div>
      </div>
    </div>
  </dv-border-box1>
</template>

<style scoped>
.bed-dashboard {
  display: flex;
  gap: 16px;
  height: 205px;
  padding: 12px 14px;
}

/* ---- 环形 ---- */
.gauge-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.gauge-outer {
  position: relative;
  width: 110px;
  height: 110px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.gauge-svg {
  position: absolute;
  width: 110px;
  height: 110px;
}

.gauge-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
}

.gauge-num {
  font-size: 30px;
  font-weight: 700;
  color: #00e5ff;
  line-height: 1.1;
  text-shadow: 0 0 12px rgba(0,229,255,0.4);
}

.gauge-unit {
  font-size: 11px;
  color: #4a7a95;
}

.gauge-label {
  color: #6a9ab5;
  font-size: 11px;
  margin-top: 4px;
}

/* ---- 科室卡片 ---- */
.dept-col {
  display: flex;
  flex-direction: column;
  gap: 5px;
  flex: 1;
  justify-content: center;
}

.dept-card {
  background: rgba(10, 25, 50, 0.5);
  border: 1px solid rgba(74, 138, 186, 0.15);
  border-radius: 6px;
  padding: 6px 10px;
  transition: border-color 0.3s;
}

.dept-card:hover {
  border-color: rgba(0, 188, 212, 0.4);
}

.dept-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.dept-name {
  color: #8ab4d6;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.dept-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #ee6666;
  animation: pulse 1.2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; box-shadow: 0 0 4px #ee6666; }
  50% { opacity: 0.4; box-shadow: 0 0 10px #ee6666; }
}

.dept-val {
  color: #d0e8ff;
  font-size: 12px;
  font-weight: 600;
}

.dept-sub {
  color: #4a7a95;
  font-weight: 400;
  font-size: 10px;
}

.dept-track {
  height: 4px;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 2px;
  overflow: hidden;
}

.dept-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.5s;
}
</style>
