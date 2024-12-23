<script setup>
import Sidenav from './components/Sidenav.vue'
import { useRoute } from 'vue-router';
const route = useRoute();
</script>

<template>
  <div id="app" class="app-container">
    <Sidenav v-if="route.name !== 'Login'" />
    <div class="main-content">
      <router-view />
    </div>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  height: 100vh; /* 使得页面填充整个视口高度 */
}

.main-content {
  flex-grow: 1; /* 使主内容区占据剩余的空间 */
  padding: 20px; /* 为内容区域增加内边距 */
  background-color: #f7f7f7; /* 可自定义背景颜色 */
  overflow-y: auto; /* 如果内容超出，启用滚动条 */
}
</style>
