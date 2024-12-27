<template>
  <div class="container">
    <!-- 导航栏收起按钮 -->
    <el-radio-group v-model="isCollapse" style="margin-bottom: 20px">
      <el-radio-button :value="false">导航栏</el-radio-button>
      <el-radio-button :value="true">收起</el-radio-button>
    </el-radio-group>

    <!-- 导航菜单 -->
    <el-menu
        default-active="2"
        class="el-menu-vertical-demo"
        :collapse="isCollapse"
        @open="handleOpen"
        @close="handleClose"
    >
      <el-sub-menu index="1">
        <template #title>
          <el-icon><location /></el-icon>
          <span>教师个人管理</span>
        </template>
        <router-link to="/infomanage">
          <el-menu-item index="1-1">
            <span>个人信息管理</span>
          </el-menu-item>
        </router-link>
        <router-link to="/coursemanage">
          <el-menu-item index="1-2">
            <span>课程管理</span>
          </el-menu-item>
        </router-link>
      </el-sub-menu>

      <router-link to="/index">
        <el-menu-item index="2">
          <el-icon><icon-menu /></el-icon>
          <template #title>
            <span>实验室预约信息</span>
          </template>
        </el-menu-item>
      </router-link>

      <router-link to="/coursereservation">
        <el-menu-item index="3">
          <el-icon><document /></el-icon>
          <template #title>
            <span>课程预约</span>
          </template>
        </el-menu-item>
      </router-link>

      <router-link to="/currentreservation">
        <el-menu-item index="4">
          <el-icon><setting /></el-icon>
          <template #title>
            <span>当前预约</span>
          </template>
        </el-menu-item>
      </router-link>
    </el-menu>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from '@element-plus/icons-vue'

// 模拟老师的名字
const username = ref("张")

const isCollapse = ref(true)
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
</script>

<style scoped>
/* 菜单样式 */
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

.el-menu-item a,
.el-menu-item a:hover {
  text-decoration: none;
  color: black;
}

.el-menu-item:hover {
  background-color: #f0f0f0;
  color: #409eff;
}

.el-menu-item {
  transition: background-color 0.3s ease, color 0.3s ease;
}

.el-menu-vertical-demo {
  width: 135px;
  min-height: 100vh;
}

.el-menu-vertical-demo .el-menu-item:hover {
  background-color: #409eff;
  color: white;
}

.el-sub-menu .el-menu-item {
  padding-left: 40px;
}

.el-sub-menu > .el-menu-item:hover {
  background-color: #d1eaff;
}

.el-menu-vertical-demo .el-sub-menu {
  background-color: #f7f7f7;
  border-radius: 5px;
}

.el-menu-item .el-icon:hover {
  color: #409eff;
}
/* 去掉下划线 */
a{
  text-decoration: none;
}
.router-link-active {
  text-decoration: none;
}


/* 高级感的欢迎信息样式 */
.welcome-message {
  font-size: 20px;
  font-weight: 600;
  color: #ffffff;
  background: linear-gradient(135deg, #6e7ff3, #5f6af8); /* 渐变背景 */
  padding: 12px 30px;
  border-radius: 30px;
  margin-bottom: 20px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15); /* 轻微阴影 */
  letter-spacing: 1px; /* 调整字母间距 */
  display: inline-block;
  width: auto;
  max-width: 350px;
  margin: 10px auto;
  font-family: 'Arial', sans-serif;
}

.welcome-message span {
  font-size: 24px; /* 更大的字体 */
  font-weight: bold;
  color: #fff;
}

/* 更精致的菜单 */
.el-menu-vertical-demo .el-menu-item {
  padding: 12px 15px;
  border-radius: 8px;
}

.el-menu-vertical-demo .el-menu-item:hover {
  background-color: #e0f4ff;
  color: #409eff;
}
</style>