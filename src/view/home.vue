<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import VisualPage1 from '@/components/VisualPage1.vue'
import VisualPage2 from '@/components/VisualPage2.vue'
import VisualPage3 from '@/components/VisualPage3.vue';
import titleBg from '@/assets/title_bg-CTB5Yqo4.png';
import lightBg from '@/assets/light_bg-DEu33pwq.png';
import VisualPage4 from '@/components/VisualPage4.vue';
import VisualPage5 from '@/components/VisualPage5.vue';
import VisualPage6 from '@/components/VisualPage6.vue';
import MidRange from '@/components/MidRange.vue';
import VisualPage7 from '@/components/VisualPage7.vue';
import VisualPage8 from '@/components/VisualPage8.vue';
import VisualPage9 from '@/components/VisualPage9.vue';
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { useDashboard } from '@/stores/dashboard';

const store = useDashboard();
const now = ref(new Date());
const noticeText = "【通知】今日心内科专家门诊正常开放 | 急诊 24 小时运行 | 下午 14:00 全院会诊 | 请各科室做好交接班记录";
let timer: ReturnType<typeof setInterval>;

onMounted(() => {
  timer = setInterval(() => now.value = new Date(), 1000);
  nextTick(() => { store.animReady = true; });
});

onUnmounted(() => {
  clearInterval(timer);
});

const formatDate = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const week = ["日", "一", "二", "三", "四", "五", "六"][d.getDay()];
  const h = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  const s = String(d.getSeconds()).padStart(2, "0");
  return `${y}年${m}月${day}日 星期${week} ${h}:${min}:${s}`;
};

// 错落入场 stagger
function stagger(i: number) {
  if (!store.animReady) return {};
  return { animationDelay: `${0.05 + i * 0.08}s` };
}
</script>

<template>
  <div class="visual-page" :class="{ ready: store.animReady }">
    <!-- 头部标题区域 -->
    <div class="header fade-in" :style="stagger(0)">
      <img class="header-light-top" :src="lightBg" alt="" />
      <div class="header-inner">
        <img class="header-title-bg" :src="titleBg" alt="" />
        <span class="header-title">医院数据可视化大屏</span>
        <div class="header-left">
          <span class="notice-icon">📢</span>
          <div class="notice-scroll">
            <span class="notice-text">{{ noticeText }}</span>
          </div>
        </div>
        <div class="header-right">
          <button class="refresh-btn" @click="store.refreshAll()" title="刷新数据">⟳</button>
          <span class="header-date">{{ formatDate(now) }}</span>
          <span class="header-temp">26°C</span>
        </div>
      </div>
      <img class="header-light-bottom" :src="lightBg" alt="" />
    </div>

    <div class="main-layout">
      <div class="top-area">
        <div class="content-row fade-in" :style="stagger(1)">
          <div class="content-col">
            <VisualPage1 />
          </div>
          <div class="content-col">
            <VisualPage2 />
          </div>
          <div class="content-col">
            <VisualPage3 />
          </div>
        </div>
        <div class="midrange-area fade-in" :style="stagger(2)">
          <MidRange />
        </div>
        <div class="content-row-right fade-in" :style="stagger(3)">
          <div class="content-col-right">
            <VisualPage7 />
          </div>
          <div class="content-col-right">
            <VisualPage8 />
          </div>
          <div class="content-col-right">
            <VisualPage9 />
          </div>
        </div>
      </div>
      <div class="content-column">
        <div class="content-c fade-in" :style="stagger(4)">
          <VisualPage4 />
        </div>
        <div class="content-c fade-in" :style="stagger(5)">
          <VisualPage5 />
        </div>
        <div class="content-c fade-in" :style="stagger(6)">
          <VisualPage6 />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ====== 大屏自适应 ====== */
.visual-page {
  width: 100%;
  min-height: 100vh;
  background-image: url(@/assets/bg.jpeg);
  background-size: cover;
  background-position: center;
}

/* ====== 错落入场动画 ====== */
.fade-in {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.ready .fade-in {
  opacity: 1;
  transform: translateY(0);
}

/* ====== 刷新按钮 ====== */
.refresh-btn {
  background: rgba(0, 188, 212, 0.1);
  border: 1px solid rgba(0, 188, 212, 0.3);
  color: #00bcd4;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.refresh-btn:hover {
  background: rgba(0, 188, 212, 0.25);
  border-color: #00e5ff;
  box-shadow: 0 0 10px rgba(0, 229, 255, 0.2);
}

.refresh-btn:active {
  transform: rotate(180deg);
}

.header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4px 0 0 0;
}

.header-light-top,
.header-light-bottom {
  width: 50%;
  height: 3px;
}

.header-inner {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.header-title-bg {
  display: block;
  width: 100%;
  height: 70px;
  object-fit: fill;
}

.header-title {
  position: absolute;
  font-size: 28px;
  font-weight: bold;
  color: #00e5ff;
  text-shadow: 0 0 10px rgba(0, 229, 255, 0.5);
  letter-spacing: 4px;
  white-space: nowrap;
}

.header-left {
  position: absolute;
  left: 40px;
  display: flex;
  align-items: center;
  gap: 8px;
  max-width: 360px;
  overflow: hidden;
}

.notice-icon {
  font-size: 28px;
  flex-shrink: 0;
}

.notice-scroll {
  overflow: hidden;
  white-space: nowrap;
  flex: 1;
  mask-image: linear-gradient(90deg, transparent 0%, #000 10%, #000 90%, transparent 100%);
  -webkit-mask-image: linear-gradient(90deg, transparent 0%, #000 10%, #000 90%, transparent 100%);
}

.notice-text {
  display: inline-block;
  color: #f0c060;
  font-size: 20px;
  letter-spacing: 1px;
  animation: noticeMarquee 18s linear infinite;
  white-space: nowrap;
}

@keyframes noticeMarquee {
  0% {
    transform: translateX(100%);
  }

  100% {
    transform: translateX(-100%);
  }
}

.header-right {
  position: absolute;
  right: 40px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.header-date {
  font-size: 16px;
  color: #b0e0ff;
  letter-spacing: 2px;
  white-space: nowrap;
}

.header-temp {
  font-size: 17px;
  color: #b0e0ff;
  font-weight: bold;
}

.main-layout {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.top-area {
  display: flex;
  align-items: stretch;
  flex: 1;
}

.content-row {
  display: flex;
  flex-direction: column;
  padding: 12px;
  gap: 2px;
}

.content-col {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.content-column {
  display: flex;
  flex: 1;
  padding: 5px;
  gap: 2px;
}

.content-c {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.content-row-right {
  display: flex;
  flex-direction: column;
  padding: 12px;
  gap: 2px;
}

.content-col-right {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.midrange-area {
  flex: 3;
  min-width: 0;
  min-height: 400px;
  margin: 0 8px;
  overflow: hidden;
}
</style>
