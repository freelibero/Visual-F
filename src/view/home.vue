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
import { ref, onMounted, onUnmounted } from 'vue';

const now = ref(new Date());
let timer: ReturnType<typeof setInterval>;

onMounted(() => {
  timer = setInterval(() => {
    now.value = new Date();
  }, 1000);
});

onUnmounted(() => {
  clearInterval(timer);
});

const formatDate = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const week = ['日', '一', '二', '三', '四', '五', '六'][d.getDay()];
  const h = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  const s = String(d.getSeconds()).padStart(2, '0');
  return `${y}年${m}月${day}日 星期${week} ${h}:${min}:${s}`;
};
</script>

<template>
  <div class="visual-page">
    <!-- 头部标题区域 -->
    <div class="header">
      <img class="header-light-top" :src="lightBg" alt="" />
      <div class="header-inner">
        <img class="header-title-bg" :src="titleBg" alt="" />
        <span class="header-title">医院数据可视化大屏</span>
        <div class="header-right">
          <span class="header-date">{{ formatDate(now) }}</span>
          <span class="header-temp">26°C</span>
        </div>
      </div>
      <img class="header-light-bottom" :src="lightBg" alt="" />
    </div>

    <div class="main-layout">
      <div class="top-area">
        <div class="content-row">
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
        <div class="midrange-area">
          <MidRange />
        </div>
        <div class="content-row-right">
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
        <div class="content-c">
          <VisualPage4 />
        </div>
        <div class="content-c">
          <VisualPage5 />
        </div>
        <div class="content-c">
          <VisualPage6 />
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.visual-page {
  width: 100%;
  min-height: 100vh;
  background-image: url(@/assets/bg.jpeg);
  background-size: cover;
  background-position: center;
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
