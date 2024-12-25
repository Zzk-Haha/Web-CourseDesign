<template>
  <div class="lab-reservation">
    <!-- 选择实验室和周次 -->
    <div class="lab-selection">
      <span class="showEX">请选择实验室和周次信息</span>
      <el-row class="selection-row" gutter="20">
        <!-- 选择实验室 -->
        <el-col :span="12">
          <el-select v-model="selectedLab" placeholder="选择实验室" @change="handleLabChange">
            <el-option
                v-for="labOption in labOptions"
                :key="labOption.value"
                :label="labOption.label"
                :value="labOption.value"
            ></el-option>
          </el-select>
        </el-col>

        <!-- 选择周次 -->
        <el-col :span="12">
          <el-select v-model="selectedWeek" placeholder="选择周次" @change="handleWeekChange">
            <el-option
                v-for="weekOption in weekOptions"
                :key="weekOption.value"
                :label="weekOption.label"
                :value="weekOption.value"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>

      <el-button type="primary" @click="confirmSelection">确认选择</el-button>
    </div>
    <!-- 实验室信息 -->
    <div class="lab-info">
      <div class="lab-header">
        <h2>{{lab.id}}-{{ lab.name }}</h2>
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
      <p>职务: {{ labManager.position }}</p>
      <p>邮件: {{ labManager.email }}</p>
      <p>联系方式: {{ labManager.phone }}</p>
    </div>
  </div>
</template>

<script setup>

// const data = {
//   "acccount" : "admin",
// }

import { ref, onMounted } from 'vue'
import { getLabInfo, getScheduleData, getLabManager,getLabs,updateScheduleData,postLabInfo,postLabManager } from '@/api/lab'


const lab = ref({
  id:'',
  name: '',
  capacity: '',
  configuration: '',
  status: '',
})
const scheduleData = ref([])  // 存储课表的周次数据
const schedulePeriods = ref([  // 存储课表的节次数据
  { period: '一二节', monday: '', tuesday: '', wednesday: '', thursday: '', friday: '' ,saturday: '',sunday: ''},
  { period: '三四节', monday: '', tuesday: '', wednesday: '', thursday: '', friday: '' ,saturday: '',sunday: ''},
  { period: '五六节', monday: '', tuesday: '', wednesday: '', thursday: '', friday: '' ,saturday: '',sunday: ''},
  { period: '七八节', monday: '', tuesday: '', wednesday: '', thursday: '', friday: '' ,saturday: '',sunday: ''},
  { period: '九十节', monday: '', tuesday: '', wednesday: '', thursday: '', friday: '' ,saturday: '',sunday: ''},
  { period: '十一十二节', monday: '', tuesday: '', wednesday: '', thursday: '', friday: '' ,saturday: '',sunday: ''},
])

const labManager = ref({
  name: '',
  position:'',
  email:'',
  phone:'',
})

const labOptions = ref([]) // 用于存储实验室选项
const weekOptions = ref([]);
for (let i = 1; i <= 20; i++) {
  weekOptions.value.push({
    value: i, // weekOption 的值
    label: `第${i}周` // weekOption 的显示文本
  });
}


const selectedLab = ref(null)  // 用户选择的实验室
const selectedWeek = ref(null) // 用户选择的周次


// 页面加载时获取数据
onMounted(async () => {
  try {

    // 获取实验室列表
    const labList = await getLabs()
   // console.log("实验室列表:", JSON.stringify(labList, null, 2));
    // 映射 labList 到 labOptions
    if (labList.code === 200 && labList.data && Array.isArray(labList.data)) {
      labOptions.value = labList.data.map(lab => ({
        value: lab.id,  // 将实验室的 id 作为选择框的值
        label: lab.name  // 将实验室的 name 作为选择框的显示文本
      }));
    }
    console.log(labOptions.value);  // 打印映射后的 labOptions 数组


    // 获取实验室信息
    const labInfo = await getLabInfo()
    lab.value = labInfo.data
    // console.log("实验室信息:", JSON.stringify(lab.value, null, 2));
    // 赋值实验室信息

    const labSchedule = await getScheduleData();
    //console.log('获取的实验室预约数据:', JSON.stringify(labSchedule.data, null, 2));

    // 解析每个项的 specifics 字段
    const parsedData = labSchedule.data.map(item => {
      const specifics = JSON.parse(item.specifics);  // 解析 specifics 字符串
      return {
        ...item,
        specifics: specifics  // 将解析后的 specifics 替换原字段
      };
    });

    // 填充课表数据
    scheduleData.value = parsedData;
    //console.log('已解析的预约数据:', JSON.stringify(scheduleData.value, null, 2));
    fillScheduleData(scheduleData.value);

    const labM = await getLabManager()
    labManager.value = labM.data
    // console.log('实验室管理员信息：', JSON.stringify(labManager.value, null, 2));

  } catch (error) {
    console.log('Lab数据获取失败')
  }



})

// 向后端发送POST请求，请求体为实验室id和week
const confirmSelection = async () => {
  // 确保用户选择了实验室和周次
  if (!selectedLab.value || !selectedWeek.value) {
    // 提示用户选择实验室和周次
    alert('请先选择实验室和周次');
    return;
  }

  const labId = selectedLab.value;
  const week = selectedWeek.value;
  const token = localStorage.getItem('token');
  // 更新实验室信息
  const updateLabInfo = await postLabInfo(labId)
  // 更新预约信息
  const labSchedule = await updateScheduleData(labId, week, token);
  // 更新实验室负责人信息
  const updatelabManager = await postLabManager(labId)

  // 更新实验室信息的逻辑
  const labInfo = updateLabInfo

  // 更新实验室负责人的逻辑
  labManager.value = updatelabManager.data

  // 更新实验室预约信息的逻辑
  lab.value = labInfo.data
  // console.log("实验室信息:", JSON.stringify(lab.value, null, 2));

  // 解析每个项的 specifics 字段
  const parsedData = labSchedule.data.map(item => {
    const specifics = JSON.parse(item.specifics);  // 解析 specifics 字符串
    return {
      ...item,
      specifics: specifics  // 将解析后的 specifics 替换原字段
    };
  });

  // 填充课表数据
  scheduleData.value = parsedData;
  // console.log('已解析的预约数据:', JSON.stringify(scheduleData.value, null, 2));
  fillScheduleData(scheduleData.value);


};


// 填充表格函数
const fillScheduleData = (data) => {
  // 清空之前的数据
  schedulePeriods.value.forEach(period => {
    period.monday = '';
    period.tuesday = '';
    period.wednesday = '';
    period.thursday = '';
    period.friday = '';
    period.saturday = '';
    period.sunday = '';
  });

  // 遍历所有预约数据
  data.forEach(item => {
    const { teacherName, courseName, specifics } = item;
    const { week, period } = specifics;

    // 根据 period 确定对应的节次索引
    let periodIndex;
    switch (period) {
      case '1-2':
        periodIndex = 0; // 一二节
        break;
      case '3-4':
        periodIndex = 1; // 三四节
        break;
      case '5-6':
        periodIndex = 2; // 五六节
        break;
      case '7-8':
        periodIndex = 3; // 七八节
        break;
      case '9-10':
        periodIndex = 4; // 九十节
        break;
      case '11-12':
        periodIndex = 5; // 十一十二节
        break;
      default:
        console.warn('未知的节次:', period);
        return;
    }

    // 根据 week 确定对应的周几索引
    let dayIndex;
    switch (week) {
      case '周一':
        dayIndex = 'monday';
        break;
      case '周二':
        dayIndex = 'tuesday';
        break;
      case '周三':
        dayIndex = 'wednesday';
        break;
      case '周四':
        dayIndex = 'thursday';
        break;
      case '周五':
        dayIndex = 'friday';
        break;
      case '周六':
        dayIndex = 'saturday';
        break;
      case '周末':
        dayIndex = 'sunday';
        break;
      default:
        console.warn('未知的周:', week);
        return;
    }

    // 将课程信息填充到对应的时间段和周几中
    if (!schedulePeriods.value[periodIndex][dayIndex]) {
      schedulePeriods.value[periodIndex][dayIndex] = ''; // 如果为空，则初始化
    }

    // 如果某个时间段已经有课程信息了，拼接新的课程信息
    if (schedulePeriods.value[periodIndex][dayIndex]) {
      schedulePeriods.value[periodIndex][dayIndex] += ', ';
    }

    schedulePeriods.value[periodIndex][dayIndex] += teacherName + '-' + courseName;
  });

  // 打印更新后的数据，方便调试
  // console.log('更新后的课表数据:', JSON.stringify(schedulePeriods.value, null, 2));
};



</script>

<style scoped>
.lab-reservation {
  padding: 40px;
  background: #f5f7fa; /* 淡灰色背景，更加柔和 */
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333; /* 深灰色字体 */
  border-top: 4px solid #8e44ad; /* 深紫色上边界 */
}

.lab-info {
  background: #ffffff;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1); /* 细腻的阴影，增强层次感 */
  margin-bottom: 30px;
  border-top: 4px solid #27ae60; /* 绿色上边界 */
}

.lab-info .lab-header {
  margin-bottom: 25px;
}

.lab-header h2 {
  font-size: 30px;
  font-weight: 600;
  color: #2c3e50; /* 深蓝灰色 */
  margin-bottom: 12px;
  line-height: 1.4;
}

.lab-info .lab-capacity,
.lab-info .lab-status,
.lab-info .lab-config {
  font-size: 16px;
  color: #7f8c8d;
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
}

.lab-info .lab-capacity {
  font-weight: 500;
}

.lab-info .lab-status,
.lab-info .lab-config {
  font-weight: 400;
}

.schedule-table {
  background: #ffffff;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); /* 深一点的阴影 */
  margin-top: 30px;
  border-top: 4px solid #f39c12; /* 金色上边界 */
}

.schedule-table .el-table {
  font-size: 14px;
  color: #333;
}

.schedule-table .el-table th {
  background: linear-gradient(135deg, #6a7f9a, #9bb2c8); /* 渐变灰蓝色，更加优雅 */
  color: #ffffff;
  font-weight: 500;
  padding: 15px;
  box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.05); /* 细微的内阴影 */
}

.schedule-table .el-table td {
  color: #444;
  padding: 15px;
}

.schedule-table .el-table-column {
  text-align: center;
  border-right: 1px solid #ececec;
}

.schedule-table .el-table-column:last-child {
  border-right: none;
}

.lab-footer {
  background: #ffffff;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); /* 深阴影 */
  margin-top: 40px;
  border-top: 4px solid #e74c3c; /* 红色上边界 */
}

.lab-footer h3 {
  font-size: 22px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 20px;
}

.lab-footer p {
  font-size: 16px;
  color: #7f8c8d;
  margin-bottom: 15px;
  line-height: 1.6;
}

.lab-footer .lab-footer-item {
  margin-bottom: 18px;
  font-weight: 400;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.lab-footer .lab-footer-item span {
  color: #5f6d7e;
  font-weight: 500;
}

.lab-footer .lab-footer-item .info {
  color: #34495e;
}

.lab-footer .lab-footer-item .icon {
  font-size: 18px;
  color: #3498db; /* 保留蓝色点缀 */
}

.lab-selection {
  background: #ffffff;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  margin-top: 0px;
  margin-bottom: 30px;
  border-top: 4px solid #9b59b6; /* 紫色上边界 */
}

.selection-row {
  margin-bottom: 10px;
}

.el-select {
  width: 100%;
}

.el-button {
  display: block;
  width: 100%;
  margin-top: 25px;
  margin-bottom: 20px;
  font-size: 16px;
  background: linear-gradient(45deg, #8e44ad, #3498db); /* 渐变紫蓝色 */
  border: none;
  color: #fff;
  border-radius: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05); /* 为按钮增加阴影 */
}

.el-button:hover {
  background: linear-gradient(45deg, #9b59b6, #2980b9); /* 按钮悬浮效果 */
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

.showEX {
  font-size: 18px;
  font-weight: 600;
  color: #fff; /* 白色字体 */
  margin-bottom: 20px;
  padding: 14px 25px;
  background: linear-gradient(45deg, #8e44ad, #3498db); /* 渐变紫蓝色 */
  border-radius: 10px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
  display: block;
  max-width: 300px;
  margin-left: auto;
  margin-right: auto;
}

</style>
