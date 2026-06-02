<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useDashboard } from "@/stores/dashboard";

const store = useDashboard();
const today = store.kpiData.today;

// 数字滚动动画
const animated = ref(today.map(() => 0));
onMounted(() => {
  today.forEach((item, idx) => {
    const step = Math.ceil(item.val / 40);
    let c = 0;
    const timer = setInterval(() => {
      c += step;
      if (c >= item.val) { c = item.val; clearInterval(timer); }
      animated.value[idx] = c;
    }, 30);
  });
});

const anim = ref(false);
onMounted(() => { setTimeout(() => anim.value = true, 100); });

const pct = (v: number, p: number) => ((v - p) / p * 100).toFixed(1);
const deltaClass = (v: number, p: number) => v >= p ? "delta-up" : "delta-down";
const deltaArrow = (v: number, p: number) => v >= p ? "↑" : "↓";
</script>

<template>
  <dv-border-box1 :style="{ width: '617px', height: '180px' }" :color="['#04c2f1', '#d2e0eeea']">
    <div class="stats-row">
      <div v-for="(s, i) in today" :key="s.key" class="stat-card" :class="{ in: anim }"
        :style="{ transitionDelay: i * 0.1 + 's' }">
        <div class="stat-line" />
        <div class="stat-body">
          <div class="stat-key">{{ s.key }}</div>
          <div class="stat-val">{{ animated[i]?.toLocaleString() }}</div>
          <div class="stat-delta" :class="deltaClass(s.val, s.prev)">
            {{ deltaArrow(s.val, s.prev) }} {{ pct(s.val, s.prev) }}%
          </div>
          <div class="stat-prev">昨日 {{ s.prev.toLocaleString() }}</div>
        </div>
        <!-- 装饰微小光点 -->
        <div class="stat-glow" />
      </div>
    </div>
  </dv-border-box1>
</template>

<style scoped>
.stats-row {
  display: flex;
  gap: 10px;
  height: 175px;
  padding: 12px 14px;
}

.stat-card {
  flex: 1;
  position: relative;
  background: linear-gradient(180deg, rgba(8, 25, 50, 0.7) 0%, rgba(3, 12, 28, 0.5) 100%);
  border: 1px solid rgba(0, 188, 212, 0.12);
  border-radius: 10px;
  overflow: hidden;
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 0.5s, transform 0.5s, border-color 0.3s, box-shadow 0.3s;
}

.stat-card.in {
  opacity: 1;
  transform: translateY(0);
}

.stat-card:hover {
  border-color: rgba(0, 229, 255, 0.35);
  box-shadow: 0 4px 20px rgba(0, 188, 212, 0.08);
}

.stat-line {
  position: absolute;
  top: 0;
  left: 20%;
  right: 20%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #00bcd4, transparent);
  opacity: 0.5;
}

.stat-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 14px 10px;
  position: relative;
  z-index: 1;
}

.stat-key {
  color: #5a8aaa;
  font-size: 12px;
  letter-spacing: 2px;
  margin-bottom: 6px;
}

.stat-val {
  font-size: 36px;
  font-weight: 800;
  background: linear-gradient(180deg, #00e5ff 0%, #0088aa 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1.15;
  margin-bottom: 6px;
  filter: drop-shadow(0 0 10px rgba(0, 229, 255, 0.3));
}

.stat-delta {
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 3px;
}

.delta-up {
  color: #91cc75;
}

.delta-down {
  color: #ee6666;
}

.stat-prev {
  font-size: 10px;
  color: #3a5a70;
}

.stat-glow {
  position: absolute;
  top: -60%;
  left: 50%;
  width: 120px;
  height: 120px;
  background: radial-gradient(circle, rgba(0, 188, 212, 0.06) 0%, transparent 70%);
  transform: translateX(-50%);
  pointer-events: none;
}
</style>
