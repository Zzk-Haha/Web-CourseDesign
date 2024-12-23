<template>
  <div class="container">
    <el-radio-group v-model="isCollapse" style="margin-bottom: 20px">
      <el-radio-button :value="false">导航栏</el-radio-button>
      <el-radio-button :value="true">收起</el-radio-button>
    </el-radio-group>
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
        <el-menu-item index="1-1">
          <router-link to="/infomanage">
            <span>个人信息管理</span>
          </router-link>

        </el-menu-item>
        <el-menu-item index="1-2">
          <router-link to="/coursemanage">
            <span>课程管理</span>
          </router-link>

        </el-menu-item>
      </el-sub-menu>

      <el-menu-item index="2">
        <el-icon><icon-menu /></el-icon>
        <template #title>
          <router-link to="/index">
            <span>实验室预约</span>
          </router-link>
        </template>

      </el-menu-item>
      <el-menu-item index="3">
        <el-icon><document /></el-icon>
        <template #title>
          <router-link to="/coursereservation">
            <span>课程预约</span>
          </router-link>
        </template>
      </el-menu-item>

      <el-menu-item index="4">
        <el-icon><setting /></el-icon>
        <template #title>
          <router-link to="/currentreservation">
            <span>当前预约</span>
          </router-link>

        </template>
      </el-menu-item>
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

const isCollapse = ref(true)
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
</script>

<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
/* 去除router-link下划线 */
.el-menu-item a,
.el-menu-item a:hover {
  text-decoration: none;
  color:black;
}

/* 鼠标悬浮效果 */
.el-menu-item:hover {
  background-color: #f0f0f0; /* 鼠标悬浮时改变背景颜色 */
  color: #409eff; /* 悬浮时字体颜色 */
}

/* 设置菜单项的动画效果 */
.el-menu-item {
  transition: background-color 0.3s ease, color 0.3s ease; /* 添加过渡效果 */
}

/* 菜单收缩时的宽度设置 */
.el-menu-vertical-demo {
  width: 135px; /* 增加宽度 */
  min-height: 100vh;
}

/* 左侧菜单悬停效果 */
.el-menu-vertical-demo .el-menu-item:hover {
  background-color: #409eff; /* 鼠标悬停时背景变蓝 */
  color: white; /* 字体颜色变白 */
}

/* 子菜单项的样式 */
.el-sub-menu .el-menu-item {
  padding-left: 40px; /* 子菜单项的缩进 */
}

/* 调整子菜单标题的悬浮效果 */
.el-sub-menu > .el-menu-item:hover {
  background-color: #d1eaff; /* 子菜单项悬浮背景颜色 */
}

.el-menu-vertical-demo .el-sub-menu {
  background-color: #f7f7f7; /* 子菜单背景颜色 */
  border-radius: 5px; /* 圆角效果 */
}

/* 鼠标悬浮时的图标颜色 */
.el-menu-item .el-icon:hover {
  color: #409eff; /* 悬浮时图标变成蓝色 */
}


</style>
