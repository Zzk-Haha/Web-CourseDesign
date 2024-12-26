<template>
  <div class="container">
    <!-- Information Tip for Teacher -->
    <div class="info-tip">
      <p>老师，以下是您的课表，您可以进行删除和添加课程的操作。</p>
    </div>

    <!-- Add Course Button -->
    <button class="add-course-btn" @click="showAddCourseForm = true">添加课程</button>

    <!-- Courses Table -->
    <div class="table-container">
      <table>
        <thead>
        <tr>
          <th>课程ID</th>
          <th>课程名称</th>
          <th>理论学时</th>
          <th>实验学时</th>
          <th>学期</th>
          <th>选课人数</th>
          <th>上课班级</th>
          <th>操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(course, index) in courses" :key="course.id">
          <td>{{ course.courseId }}</td>
          <td>{{ course.courseName }}</td>
          <td>{{ course.hours }}</td>
          <td>{{ course.experimentHours }}</td>
          <td>{{ course.semester }}</td>
          <td>{{ course.courseNums }}</td>
          <td>{{ course.currentClass }}</td>
          <td>
            <button class="remove-btn" @click="removeCourse(index)">删除</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- Add Course Form -->
    <div v-if="showAddCourseForm" class="overlay" @click="showAddCourseForm = false">
      <div class="add-course-form" @click.stop>
        <form @submit.prevent="addCourse">
          <div class="form-group">
            <label for="courseId">课程ID</label>
            <input v-model="newCourse.id" type="text" id="courseId" placeholder="请输入课程ID" required />
          </div>

          <div class="form-group">
            <label for="courseName">课程名称</label>
            <input v-model="newCourse.name" type="text" id="courseName" placeholder="请输入课程名称" required />
          </div>

          <div class="form-group">
            <label for="theoreticalHours">理论学时</label>
            <input v-model="newCourse.theoreticalHours" type="number" id="theoreticalHours" placeholder="请输入理论学时" min="0" required />
            <span class="input-help">请输入课程的理论学时，必须为正数。</span>
          </div>

          <div class="form-group">
            <label for="experimentalHours">实验学时</label>
            <input v-model="newCourse.experimentalHours" type="number" id="experimentalHours" placeholder="请输入实验学时" min="0" required />
            <span class="input-help">请输入课程的实验学时，必须为正数。</span>
          </div>

          <div class="form-group">
            <label for="semester">学期</label>
            <select v-model="newCourse.semester" id="semester" required>
              <option value="" disabled selected>请选择学期</option>
              <option v-for="semester in semesters" :key="semester" :value="semester">{{ semester }}</option>
            </select>
          </div>

          <div class="form-group">
            <label for="studentCount">选课人数</label>
            <input v-model="newCourse.studentCount" type="number" id="studentCount" placeholder="请输入选课人数" min="0" required />
            <span class="input-help">请输入选课人数，必须为正数。</span>
          </div>

          <div class="form-group">
            <label for="class">上课班级</label>
            <input v-model="newCourse.class" type="text" id="class" placeholder="请输入上课班级" required />
          </div>

          <div class="form-actions">
            <button type="submit" @click="submitAndFetchData">确认添加</button>
            <button type="button" @click="showAddCourseForm = false">取消</button>
          </div>
        </form>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getCourseData, delCourse } from "@/api/course.js";
import axios from "axios";
import {ElMessage, ElMessageBox} from "element-plus";

const Info = ref({ id: '', name: '', major: '', email: '', phone: '', avatar: '', account: '', webName: '' });
const courses = ref([]);
const newCourse = ref({ id: '', name: '', theoreticalHours: 0, experimentalHours: 0, semester: '', studentCount: 0, class: '' });
const showAddCourseForm = ref(false);
const errorMessage = ref('');

// Define semesters dynamically
const currentYear = new Date().getFullYear();
const semesters = ref([]);
for (let i = currentYear; i <= currentYear + 4; i++) {
  semesters.value.push(`${i}-${i + 1}-1`);
  semesters.value.push(`${i}-${i + 1}-2`);
}

// Fetch initial data
onMounted(async () => {
  const storedUserData = localStorage.getItem('userData');
  if (storedUserData) {
    Info.value = JSON.parse(storedUserData);
    courses.value = await getCourseData(Info.value.account);
  }
});

// Submit course data
async function submitCourseData() {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('Token is missing.');
    throw new Error('后端未验证，无法登录');
  }

  if (!newCourse.value.id || !newCourse.value.name || !newCourse.value.semester || !newCourse.value.class ||
      newCourse.value.theoreticalHours < 0 || newCourse.value.experimentalHours < 0 || newCourse.value.studentCount < 0) {
    errorMessage.value = '所有字段都不能为空，且理论学时、实验学时、选课人数不能小于0。';
    return;
  }

  const requestData = {
    teacherAccount: Info.value.account,
    courseId: newCourse.value.id,
    courseName: newCourse.value.name,
    semester: newCourse.value.semester,
    courseNums: newCourse.value.studentCount,
    currentClass: newCourse.value.class,
    experimentHours: newCourse.value.experimentalHours,
    hours:newCourse.value.theoreticalHours,
  };

  try {
    const response = await axios.post('http://localhost:8080/api/teacher/addCourse', requestData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    if (response.data.code === 200) {
      courses.value.push({
        courseId: newCourse.value.id,
        courseName: newCourse.value.name,
        hours: newCourse.value.theoreticalHours,
        experimentHours: newCourse.value.experimentalHours,
        semester: newCourse.value.semester,
        courseNums: newCourse.value.studentCount,
        currentClass: newCourse.value.class

      });
      showAddCourseForm.value = false;
    }
  } catch (error) {
    console.error('提交数据失败:', error);
    errorMessage.value = '提交课程数据失败，请稍后再试。';
  }
}

// 提交课程
async function submitAndFetchData() {
  const storedUserData = localStorage.getItem('userData');
  if(storedUserData) {
    try {
      teacherInfo.value = JSON.parse(storedUserData);
    } catch(error) {
      console.log("无法解析localStorage中的用户数据：",error);
    }
  }

  await submitCourseData(); // 先提交数据
  //提示课程添加成功
  ElMessage.success('课程添加成功');
  courses.value = await getCourseData(Info.value.account)
}

// Remove course
async function removeCourse(index) {
  const course = courses.value[index];
  const courseId = course.courseId;
  const teacherAccount = Info.value.account;

  await ElMessageBox.confirm(
      '删除后不可恢复，您确定要删除此项吗？',
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'custom-messagebox',
      }
  );


  try {
    const result = await delCourse(teacherAccount, courseId);
    if (result && result.code === 200) {
      courses.value.splice(index, 1);
      ElMessage.success('课程删除成功');
    } else {
      ElMessage.error('课程删除失败，请稍后再试');
    }
  } catch (error) {
    console.error('删除课程失败:', error);
    ElMessage.error('删除课程时发生错误，请稍后再试');
  }
}
</script>

<style scoped>
/* Information Tip Styling */
/* Information Tip Styling */
.info-tip {
  background-color: #D1E7FF; /* 柔和的蓝色背景 */
  color: #1E3A8A; /* 深蓝色文字 */
  padding: 12px 20px;
  border-radius: 8px;
  margin-bottom: 20px; /* 与下面的内容保持适当的间距 */
  font-size: 16px;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* 给提示条添加一点阴影 */
  display: flex;
  align-items: center;
}

/* Add Course Button */
.add-course-btn {
  background-color: #3b82f6;
  color: white;
  font-size: 16px;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.add-course-btn:hover {
  background-color: #2563eb;
}

/* Table Container */
.table-container {
  margin-top: 30px;
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid #ddd;
}

/* Table styling */
table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

th, td {
  padding: 15px;
  text-align: left;
  font-size: 14px;
  color: #333;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #3b82f6;
  color: white;
}

tr:nth-child(even) {
  background-color: #f9fafb;
}

tr:hover {
  background-color: #f1f5f9;
}

.remove-btn {
  background-color: #f87171;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.remove-btn:hover {
  background-color: #ef4444;
}

/* Overlay for form background */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* Add Course Form Styling */
.add-course-form {
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  width: 500px; /* Centered form width */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 2px solid #ddd;
  z-index: 1010;
  box-sizing: border-box; /* Ensure padding and borders are included in width */
}

/* Adjusting spacing between form items */
.form-group {
  margin-bottom: 16px;
}

.form-group label {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 4px;
  display: block;
  color: #333;
}

.add-course-form input, .add-course-form select, .add-course-form button {
  width: 100%; /* Make sure form inputs are 100% of the container's width */
  padding: 10px 14px;
  margin: 8px 0;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  box-sizing: border-box; /* Ensures borders and padding are included in the width */
}

/* Input Help Styling */
.input-help {
  font-size: 12px;
  color: #888;
  margin-top: 6px;
}

/* Form Action Buttons Styling */
.add-course-form .form-actions {
  display: flex;
  justify-content: space-between;
}

.add-course-form .form-actions button {
  width: 48%;
  padding: 12px 20px;
  border-radius: 8px;
  background-color: #3b82f6;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.add-course-form .form-actions button:hover {
  background-color: #2563eb;
}

.add-course-form button[type="button"] {
  background-color: #f87171;
}

.add-course-form button[type="button"]:hover {
  background-color: #ef4444;
}

.add-course-form .error-message {
  color: red;
  font-size: 14px;
  margin-top: 10px;
}

/* Close the form when clicked outside */
.overlay .add-course-form {
  box-sizing: border-box;
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .add-course-form {
    width: 90%;
  }

  .add-course-form input, .add-course-form select, .add-course-form button {
    font-size: 14px;
  }

  .add-course-form .form-actions {
    flex-direction: column;
  }

  .add-course-form .form-actions button {
    width: 100%;
    margin-bottom: 10px;
  }

  .container {
    padding: 10px;
  }
}
</style>
