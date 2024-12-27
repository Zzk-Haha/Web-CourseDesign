<template>
  <el-aside width="250px" class="sidebar">
    <el-menu
        default-active="1"
        class="el-menu-vertical-demo"
        background-color="#2c3e50"
        text-color="#fff"
        active-text-color="#42b983"
        :router="true"
        :collapse="false"
    >
      <!-- 教师信息 -->
      <el-menu-item index="1" :route="{ path: '/adminmanage' }">
        <i class="el-icon-book"></i>
        <span>教师信息</span>
      </el-menu-item>

      <!-- 实验室信息 -->
      <el-menu-item index="2" :route="{ path: '/adminlab' }">
        <i class="el-icon-office-building"></i>
        <span>实验室信息</span>
      </el-menu-item>

      <!-- 课程信息 -->
      <el-menu-item index="3" :route="{ path: '/admincourse' }">
        <i class="el-icon-user"></i>
        <span>课程信息</span>
      </el-menu-item>

      <!-- 实验室负责人 -->
      <el-menu-item index="4" :route="{ path: '/adminlabmanager' }">
        <i class="el-icon-scope"></i>
        <span>实验室负责人信息</span>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>

<script>
export default {
  data() {
    return {};
  },
};
</script>

<style scoped>
.sidebar {
  background-color: #2c3e50;
  color: white;
  height: 100vh;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  padding-top: 20px;
  transition: all 0.3s ease;
}

.el-menu-vertical-demo {
  font-size: 16px;
  padding-top: 20px;
}

.el-menu-item {
  padding: 15px 25px;
  font-size: 16px;
  transition: background-color 0.3s, color 0.3s;
}

.el-menu-item .el-icon {
  margin-right: 15px;
  font-size: 18px;
}

.el-menu-item span {
  display: inline-block;
  vertical-align: middle;
}

.el-menu-item a {
  text-decoration: none; /* 取消下划线 */
}

.el-menu-item:hover {
  background-color: #42b983;
  color: white;
  box-shadow: 3px 0 8px rgba(66, 185, 131, 0.3); /* 增加悬浮时的阴影效果 */
}

.el-menu-item.active {
  background-color: #42b983;
  color: white;
}

.el-menu-item.active i {
  color: #fff;
}

.el-menu-item.active span {
  font-weight: bold;
}

.el-menu-item:hover i {
  color: #fff;
}

.el-menu-item span {
  font-weight: normal;
  transition: font-weight 0.2s ease;
}

.el-menu-item:hover span {
  font-weight: bold;
}
</style>
