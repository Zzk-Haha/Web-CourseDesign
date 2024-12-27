<template>
  <div class="reservation-container">
    <!-- 友好提示区域 -->
    <div class="welcome-message">
      <h2>亲爱的 <span class="user-name">{{ teacherInfo.name }}</span>，这是您的预约信息</h2>
    </div>

    <el-card class="reservation-card" shadow="always">
      <el-table :data="reservations" style="width: 100%" stripe>
        <el-table-column label="课程名称" prop="courseName" width="180" class-name="table-column-bold" />
        <el-table-column label="教师姓名" prop="teacherName" width="180" class-name="table-column-bold" />
        <el-table-column label="实验室名称" prop="name" width="150" class-name="table-column-bold" />
        <el-table-column label="预约周次" prop="week" width="150">
          <template #default="{ row }">
            <span class="highlight-week">{{ formatWeek(row.week) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="星期" prop="specifics">
          <template #default="{ row }">
            <span class="highlight-column">{{ JSON.parse(row.specifics).week }}</span>
          </template>
        </el-table-column>
        <el-table-column label="节次" prop="specifics">
          <template #default="{ row }">
            <span class="highlight-column">{{ JSON.parse(row.specifics).period }}</span>
          </template>
        </el-table-column>
        <el-table-column label="最近预约时间" prop="reservationDate" width="220">
          <template #default="{ row }">
            <span class="highlight-column">{{ formatDate(row.reservationDate) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button @click="handleDelete(row)" type="danger" size="mini" icon="el-icon-delete" class="delete-btn">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import { ElTable, ElTableColumn, ElButton, ElMessage, ElMessageBox, ElCard, ElAlert } from 'element-plus';
import { reservation, removeReservation } from '@/api/reservation.js';

const reservations = ref([]);

let teacherInfo = reactive({
  id: '',
  name: '',
  major: '',
  email: '',
  phone: '',
  avatar: '',
  account: '',
  webName: '',
});

onMounted(async () => {



  const storedUserData = localStorage.getItem('userData');

  if (storedUserData) {
    try {
      // 解析存储的 JSON 字符串并赋值给 teacherInfo
      Object.assign(teacherInfo, JSON.parse(storedUserData));
    } catch (error) {
      console.error('无法解析 localStorage 中的用户数据:', error);
    }
  }

  // 拉取该教师的预约信息
  const reply = await reservation(teacherInfo.account);
  reservations.value = reply.data;
  // console.log("这是当前浏览器存储的个人信息："+(storedUserData))
  // console.log("这是teacherInfo的信息："+JSON.stringify(teacherInfo));


});

function formatWeek(week) {
  return "第" + week + "周";
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };
  return date.toLocaleString('zh-CN', options);
}

async function handleDelete(row) {
  const specifics = JSON.parse(row.specifics);
  const { courseId, labId, teacherAccount, week, teacherName, courseName } = row;
  const { week: xingQi, period } = specifics;

  try {
    await ElMessageBox.confirm(
        '删除后不可恢复，您需要重新预约，您确定要删除此预约吗？',
        '确认删除',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'custom-messagebox',
        }
    );

    const result = await removeReservation(teacherAccount, week, labId, xingQi, period);

    if (result.code === 200) {
      const index = reservations.value.findIndex(item => item.id === row.id);
      if (index !== -1) {
        reservations.value.splice(index, 1);
      }
      ElMessage.success('删除成功');
    } else {
      ElMessage.error('删除失败，请稍后再试');
    }
  } catch (error) {
    if (error === 'cancel') {
      console.log('用户取消了删除操作');
    } else {
      console.error('删除预约失败:', error);
      ElMessage.error('删除过程中发生错误');
    }
  }
}
</script>

<style scoped>
/* 背景和整体容器的渐变效果 */
.reservation-container {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #e3f2fd 10%, #d1c4e9 90%);  /* 渐变背景效果 */
  z-index: -1;  /* 让背景层在最底层 */
}

/* 友好提示信息的美化 */
.welcome-message {
  background: linear-gradient(135deg, #ff8a65, #ff7043); /* 温暖的渐变色 */
  padding: 15px 25px;
  border-radius: 12px;
  color: #fff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.welcome-message h2 {
  font-size: 24px;
  margin: 0;
}

.user-name {
  font-weight: bold;
  color: #ffeb3b;
}

/* 卡片样式 */
.reservation-card {
  padding: 20px;
  border-radius: 16px;
  background-color: #ffffff;
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.1); /* 增强阴影效果 */
  margin-top: 20px;
  border: 1px solid #dcdfe6;
}

/* 表格样式 */
.el-table {
  border-radius: 10px;
  background-color: #fff;
  border: none;
  overflow: hidden;
}

.el-table th {
  background-color: #f1f8e9;  /* 清新的背景色 */
  color: #333;
  font-weight: 600;
  font-size: 14px;
  border-bottom: 2px solid #e4e7ed;
}

.el-table td {
  padding: 14px 20px;
  font-size: 14px;
  color: #555;
  border-bottom: 1px solid #e4e7ed;
  text-align: center;
}

.el-table tr:hover {
  background-color: #f5f5f5;  /* 鼠标悬停时变色 */
}

.table-column-bold .cell {
  font-weight: 600;
}

.highlight-week {
  color: #409EFF;  /* 高亮显示周次 */
}

.highlight-column {
  color: #67C23A;  /* 高亮显示其他列 */
}

.delete-btn {
  border-radius: 24px;
  padding: 8px 20px;
  background: linear-gradient(to right, #ff4d4f, #f56c6c);
  color: white;
  font-size: 14px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  display: inline-flex;  /* 使用 inline-flex 确保按钮中的内容水平对齐 */
  align-items: center;   /* 垂直居中 */
  justify-content: center; /* 水平居中 */
  min-width: 80px;
  height: 32px; /* 设置固定高度以确保按钮内的内容能够居中 */
  line-height: 1; /* 解决多行文本对齐问题 */
}

.delete-btn:hover {
  background: linear-gradient(to right, #e74c3c, #ff4757);
  transform: translateY(-2px);
}

.delete-btn:active {
  background: linear-gradient(to right, #e74c3c, #d83a3a);
  transform: translateY(1px);
}

/* 自定义弹出框样式 */
.custom-messagebox .el-message-box__header {
  background-color: #f56c6c;
  color: white;
  font-weight: bold;
}

.custom-messagebox .el-message-box__body {
  font-size: 16px;
  color: #333;
}

.custom-messagebox .el-message-box__button {
  font-size: 16px;
}

/* 添加表格行的分隔线 */
.el-table th, .el-table td {
  border-bottom: 2px solid #e4e7ed;
}

.el-table td {
  text-align: center;
}

.el-table .cell {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 微调表格列标题和数据行间距 */
.el-table th,
.el-table td {
  padding: 10px 16px;
}

.el-table .cell {
  word-wrap: break-word;
  word-break: break-word;
  max-width: 200px;
}
/* 优化标题样式 */
.reservation-container h2 {
  font-size: 24px;
  font-weight: 700;
  color: #333; /* 深色字体 */
  text-align: center;
  margin-bottom: 20px; /* 增加下边距 */
  padding: 10px;
  background: linear-gradient(to right, #ff7e5f, #feb47b); /* 渐变背景色 */
  border-radius: 8px; /* 圆角效果 */
  color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* 轻微阴影效果 */
  letter-spacing: 1px; /* 增加字间距 */
}

/* 优化亲爱的部分的字体样式 */
.reservation-container h2 span {
  font-size: 26px;
  color: #409EFF; /* 亲爱的部分使用蓝色 */
  font-weight: bold;
}


</style>