<template>
  <div class="lab-reservation">
    <!-- 实验室信息 -->
    <div class="lab-info">
      <div class="lab-header">
        <h2>{{ lab.name }}</h2>
        <div class="lab-capacity">容量: {{ lab.capacity }} 人</div>
        <div class="lab-status">状态: {{ lab.status }}</div>
        <div class="lab-config">配置信息: {{ lab.configuration }}</div>
      </div>
    </div>

    <!-- 课表 -->
    <div class="schedule-table">
      <el-table border :data="schedulePeriods">
        <el-table-column label="节次\星期" prop="period"></el-table-column>
        <el-table-column label="周一" prop="monday"></el-table-column>
        <el-table-column label="周二" prop="tuesday"></el-table-column>
        <el-table-column label="周三" prop="wednesday"></el-table-column>
        <el-table-column label="周四" prop="thursday"></el-table-column>
        <el-table-column label="周五" prop="friday"></el-table-column>
        <el-table-column label="周六" prop="saturday"></el-table-column>
        <el-table-column label="周末" prop="sunday"></el-table-column>
      </el-table>
    </div>

    <!-- 负责人信息 -->
    <div class="lab-footer">
      <h3>实验室负责人</h3>
      <p>负责人: {{ labManager.name }}</p>
      <p>联系方式: {{ labManager.contact }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
// import { getLabInfo, getScheduleData, getLabManager } from '@/api/lab'

const lab = ref({
  name: '',
  capacity: '',
  configuration: '',
  status: '',
})
const scheduleData = ref([])  // 存储课表的周次数据
const schedulePeriods = ref([  // 存储课表的节次数据
  { period: '一二节', monday: '', tuesday: '', wednesday: '', thursday: '', friday: '' },
  { period: '三四节', monday: '', tuesday: '', wednesday: '', thursday: '', friday: '' },
  { period: '五六节', monday: '', tuesday: '', wednesday: '', thursday: '', friday: '' },
  { period: '七八节', monday: '', tuesday: '', wednesday: '', thursday: '', friday: '' },
  { period: '九十节', monday: '', tuesday: '', wednesday: '', thursday: '', friday: '' },
  { period: '十一十二节', monday: '', tuesday: '', wednesday: '', thursday: '', friday: '' },
])

const labManager = ref({
  name: '',
  contact: '',
})

// 页面加载时获取数据
onMounted(async () => {
  try {
    lab.value = await getLabInfo()
    scheduleData.value = await getScheduleData()
    labManager.value = await getLabManager()
    // 填充课表的周次和节次数据
    fillScheduleData(scheduleData.value)
  } catch (error) {
    console.error('Error fetching data:', error)
  }
})

// 填充课表数据
const fillScheduleData = (data) => {
  data.forEach(item => {
    // 假设返回的数据包含周次和节次的安排，填充节次的数据
    schedulePeriods.value.forEach(period => {
      if (item.week === '周一' && item.period === period.period) period.monday = item.teacher;
      if (item.week === '周二' && item.period === period.period) period.tuesday = item.teacher;
      if (item.week === '周三' && item.period === period.period) period.wednesday = item.teacher;
      if (item.week === '周四' && item.period === period.period) period.thursday = item.teacher;
      if (item.week === '周五' && item.period === period.period) period.friday = item.teacher;
    })
  })
}
</script>

<style scoped>
.lab-reservation {
  padding: 30px;
  background: #f4f7fa;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.lab-info {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.lab-header h2 {
  font-size: 24px;
  color: #333;
  margin-bottom: 10px;
}

.lab-info .lab-capacity,
.lab-info .lab-status,
.lab-info .lab-config {
  font-size: 16px;
  color: #666;
  margin-bottom: 5px;
}

.schedule-table {
  margin-top: 20px;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.schedule-table .el-table {
  font-size: 14px;
}

.lab-footer {
  margin-top: 30px;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.lab-footer h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 10px;
}

.lab-footer p {
  font-size: 16px;
  color: #666;
  margin-bottom: 5px;
}
</style>
