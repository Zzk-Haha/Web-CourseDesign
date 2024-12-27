<template>
  <div class="lab-reservation-container">
    <h2>实验室预约管理系统</h2>
    <div class="input-section">
      <label for="studentCount">请选择实验室容量>=</label>
      <input v-model.number="studentCount"
             type="number" id="studentCount"
             name="studentCount"
             @input="handleStudentCountInput" />
      <button @click="fetchLabs" class="primary-button">查询实验室</button>
    </div>
    <div v-if="labs.length > 0" class="lab-table-container">
      <table>
        <thead>
        <tr>
          <th>实验室名称</th>
          <th>实验室容量</th>
          <th>实验室状态</th>
          <th>实验室配置</th>
          <th>预约操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="lab in labs" :key="lab.id">
          <td>{{ lab.name }}</td>
          <td>{{ lab.capacity }}</td>
          <td>{{ lab.status }}</td>
          <td>{{lab.configuration}}</td>
          <td>
            <button @click="openModal(lab.id)" class="secondary-button">预约</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="modal" v-if="showModal">
      <div class="modal-content">
        <span class="close" @click="closeModal">&times;</span>
        <form @submit.prevent="submitForm">
          <div class="form-field">
            <label for="courseId">课程 ID:</label>
            <input v-model="courseId" type="text" id="courseId" name="courseId" />
          </div>
          <div class="form-field">
            <label for="courseName">课程名称:</label>
            <input v-model="courseName" type="text" id="courseName" name="courseName" />
          </div>
          <div class="form-field">
            <label for="tempReservation">是否临时预约:</label>
            <select v-model="tempReservation">
              <option value="false">否</option>
              <option value="true">是</option>
            </select>
          </div>
          <div class="form-field">
            <label for="week">周次:</label>
            <select v-model="week">
              <option v-for="n in 18" :key="n" :value="n">{{ n }}</option>
            </select>
          </div>
          <div class="form-field">
            <label for="day">星期:</label>
            <select v-model="day">
              <option value="周一">周一</option>
              <option value="周二">周二</option>
              <option value="周三">周三</option>
              <option value="周四">周四</option>
              <option value="周五">周五</option>
              <option value="周六">周六</option>
              <option value="周末">周末</option>
            </select>
          </div>
          <div class="form-field">
            <label for="period">节次:</label>
            <select v-model="period">
              <option value="1-2">1-2</option>
              <option value="3-4">3-4</option>
              <option value="5-6">5-6</option>
              <option value="7-8">7-8</option>
              <option value="9-10">9-10</option>
              <option value="11-12">11-12</option>
            </select>
          </div>
          <button type="submit" class="primary-button">提交预约</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { getLabCapacity } from '@/api/courseReservation';
import axios from 'axios';
import { ElMessage } from "element-plus";

// 响应式变量
const studentCount = ref(0);
const labs = ref([]);
const showModal = ref(false);
const courseId = ref('');
const courseName = ref('');
const tempReservation = ref('false');
const week = ref('1');
const day = ref('周一');
const period = ref('1-2');
const selectedLabId = ref(null);

// 函数：处理学生人数输入
const handleStudentCountInput = () => {
  if (studentCount.value < 0) {
    studentCount.value = 0;
  }
};

// 函数：获取实验室
const fetchLabs = async () => {
  try {
    const LabData = await getLabCapacity(studentCount.value);
    labs.value = LabData.data;

    if(LabData.data.length === 0){
      ElMessage.error("没有实验室可以容纳这么多人");
    }else{

      ElMessage.success("获取实验室成功");
    }
  } catch (error) {
    console.error('获取实验室信息时出错:', error);
  }
};

// 函数：打开模态框
const openModal = (labId) => {
  showModal.value = true;
  selectedLabId.value = labId;
};

// 函数：关闭模态框
const closeModal = () => {
  showModal.value = false;
};

// 获取用户信息
const Info = ref({ id: '', name: '', major: '', email: '', phone: '', avatar: '', account: '', webName: '' });

onMounted(async () => {
  const storedUserData = localStorage.getItem('userData');
  if (storedUserData) {
    Info.value = JSON.parse(storedUserData);
  }
});

// 函数：提交表单
const submitForm = async () => {
  const teacherAccount = Info.value.account;
  const teacherName = Info.value.name;
  const specifics = JSON.stringify({ week: day.value, period: period.value });

  const requestBody = {
    teacherAccount: teacherAccount,
    courseId: courseId.value,
    labId: selectedLabId.value,
    teacherName: teacherName,
    courseName: courseName.value,
    tempReservation: tempReservation.value,
    specifics: specifics,
    week: week.value
  };

  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token is missing.');
      throw new Error('后端未验证，无法登录');
    }

    const requestData = { teacherAccount: teacherAccount, courseId: courseId.value };

    const validationResponse = await axios.post('http://localhost:8080/api/teacher/checkCourse', requestData, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (validationResponse.data.code === 200) {
      const reserveResponse = await axios.post('http://localhost:8080/api/teacher/addReservation', requestBody,{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // 加上 Authorization 头部
        }
      });
      if (reserveResponse.data.code === 200) {
        ElMessage.success("预约成功");
        closeModal();
      }else if ((reserveResponse.data.code === 409)){
        ElMessage.error("该时段已被占用，预约失败");
      }
      else {
        ElMessage.error("预约失败，请检查网络连接");
      }
    } else if (validationResponse.data.code === 404) {
      ElMessage.error('您还未拥有此课程，请到课程管理手动添加');
    } else {
      console.error('课程验证失败');
    }
  } catch (error) {
    console.error('提交表单时出错:', error);
  }
};
</script>

<style scoped>

.lab-reservation-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 30px;
  background: linear-gradient(135deg, #f9f9f9, #ffffff);
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  font-family: 'Roboto', sans-serif;
  color: #333;
}

h2 {
  font-size: 28px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

.input-section {
  display: flex;
  align-items: center; /* 使label和input居中对齐 */
  justify-content: space-between;
  margin-bottom: 20px;
}

.input-section label {
  font-size: 18px; /* 增加字体大小 */
  font-weight: 500;
  color: #333;
  width: 30%; /* 设置固定宽度，让label与input对齐 */
  text-align: right; /* 将label的文本向右对齐 */
  margin-right: 20px; /* 给label和input之间添加一些间距 */
}

.input-section input {
  width: 60%; /* 输入框占60%的宽度 */
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 16px;
  transition: border-color 0.3s, box-shadow 0.3s ease;
}

.input-section input:focus {
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}
.primary-button {
  background-color: #4CAF50;
  color: white;
  padding: 12px 25px;
  font-size: 16px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 150px;
  height: 50px;
  margin: 0 10px;
}


.primary-button:hover {
  background-color: #45a049;
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.primary-button:active {
  background-color: #388e3c;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transform: translateY(0);
}

.primary-button:focus {
  outline: none;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5); /* 蓝色焦点 */
}

.primary-button.disabled {
  background-color: #b5e8a3;
  cursor: not-allowed;
  box-shadow: none;
}

.secondary-button {
  background-color: #007bff;
  color: white;
  padding: 8px 16px;
  font-size: 14px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
}

.secondary-button:hover {
  background-color: #0056b3;
}

.lab-table-container {
  margin-bottom: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

table, th, td {
  border: 1px solid #ddd;
}

th, td {
  padding: 12px;
  text-align: left;
  font-size: 16px;
}

th {
  background-color: #f4f4f4;
  font-weight: 600;
  color: #555;
}

tr:nth-child(even) {
  background-color: #f9f9f9;
}

tr:hover {
  background-color: #f1f1f1;
}

.modal {
  display: block;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.5);
  transition: opacity 0.3s ease;
}

.modal-content {
  background-color: #fff;
  margin: 10% auto;
  padding: 30px;
  border: 1px solid #ddd;
  width: 80%;
  max-width: 600px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.close {
  color: #aaa;
  float: right;
  font-size: 30px;
  font-weight: bold;
  cursor: pointer;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
}

.form-field {
  margin-bottom: 20px;
}

.form-field label {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  display: block;
  margin-bottom: 8px;
}

.form-field input {
  width: 90%;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 16px;
  margin-bottom: 12px;
}

.form-field input:focus {
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

button[type="submit"] {
  background-color: #007bff;
  color: white;
  padding: 12px 25px;
  font-size: 16px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
}

button[type="submit"]:hover {
  background-color: #0056b3;
}

/* 跟进下拉框 */
/* 改进下拉框样式 */
.form-field select {
  width: 90%;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 16px;
  margin-bottom: 12px;
  background-color: #fff;
  appearance: none; /* 去掉原生浏览器样式 */
  -webkit-appearance: none;
  -moz-appearance: none;
  position: relative; /* 用于定位下拉箭头 */
}

.form-field select:focus {
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

.form-field select:hover {
  border-color: #007bff;
}

/* 下拉框箭头 */
.form-field select::after {
  content: '▼'; /* 自定义下拉箭头 */
  font-size: 14px;
  color: #aaa;
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  pointer-events: none;
}

/* 为了使选择框和箭头更加协调，可以添加一个背景 */
.form-field select:focus::after {
  color: #007bff;
}

/* 用伪元素来创建一个下拉框背景 */
.form-field select::-ms-expand {
  display: none; /* 禁止 IE 的默认下拉箭头 */
}

.form-field select option {
  padding: 10px;
  font-size: 16px;
}

/* 下拉框打开时的动画 */
.form-field select {
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.form-field select option:hover {
  background-color: #f1f1f1;
  color: #007bff;
}

/* 更加突出的选中项样式 */
.form-field select option:checked {
  background-color: #007bff;
  color: white;
}

.form-field select:focus {
  outline: none; /* 移除默认的焦点样式 */
}


</style>

