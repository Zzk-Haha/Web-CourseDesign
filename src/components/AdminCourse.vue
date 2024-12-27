<template>
  <div class="courseList">
    <!-- 管理员提示信息 -->
    <div class="admin-tip">
      <el-row>
        <el-col :span="24">
          <div class="admin-tip-content">
            <el-icon name="el-icon-info" class="admin-tip-icon" />
            <span class="admin-tip-text">欢迎来到实验室预约管理系统 - 管理员界面</span>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 添加课程区域 -->
    <div class="addCourse">
      <div class="section-header">
        <span>添加课程</span>
      </div>
      <div class="section-description">
        请填写以下表单添加新课程。
      </div>
      <el-row gutter="20">
        <el-col :span="6">
          <el-input v-model="newCourse.id" placeholder="课程ID" class="input-field" />
        </el-col>
        <el-col :span="6">
          <el-input v-model="newCourse.name" placeholder="课程名称" class="input-field" />
        </el-col>
        <el-col :span="6">
          <el-input v-model="newCourse.hours" placeholder="理论学时" class="input-field" />
        </el-col>
        <el-col :span="6">
          <el-input v-model="newCourse.experimentHours" placeholder="实验学时" class="input-field" />
        </el-col>
        <el-col :span="6">
          <el-input v-model="newCourse.description" placeholder="课程描述" class="input-field" />
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="addNewCourse" class="add-button">添加</el-button>
        </el-col>
      </el-row>
    </div>

    <!-- 课程列表区域 -->
    <div class="courseTable">
      <div class="section-header">
        <span>课程列表</span>
      </div>
      <div class="section-description">
        这里展示所有已添加的课程信息，您可以进行删除操作。
      </div>
      <el-table border :data="courses" class="course-table">
        <el-table-column label="课程名称" prop="name"></el-table-column>
        <el-table-column label="课程ID" prop="id"></el-table-column>
        <el-table-column label="理论学时" prop="hours"></el-table-column>
        <el-table-column label="实验学时" prop="experimentHours"></el-table-column>
        <el-table-column label="课程描述" prop="description"></el-table-column>
        <el-table-column label="操作" fixed="right">
          <template #default="scope">
            <el-button type="danger" @click="confirmDelete(scope.row)" class="delete-button">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getCourses, addCourse, deleteCourse } from '@/api/adminCourse'
import { ElMessageBox, ElMessage } from 'element-plus'

const courses = ref([]);
const newCourse = ref({
  id: '',
  name: '',
  hours: '',
  experimentHours: '',
  description: ''
});

// 页面加载时获取课程列表
onMounted(async () => {
  try {
    const courseList = await getCourses();
    courses.value = courseList.data;
  } catch (error) {
    ElMessage.error('获取课程列表时出错：' + error.message);
  }
});

// 添加新课程
const addNewCourse = async () => {
  if (!newCourse.value.id || !newCourse.value.name || !newCourse.value.hours || !newCourse.value.experimentHours || !newCourse.value.description) {
    ElMessage.warning('请填写所有必填信息');
    return;
  }

  const newCourseData = {
    id: newCourse.value.id,
    name: newCourse.value.name,
    hours: newCourse.value.hours,
    experimentHours: newCourse.value.experimentHours,
    description: newCourse.value.description
  };

  try {
    const response = await addCourse(newCourseData);

    if (response.code === 200) {
      ElMessage.success('课程添加成功');
      const updatedCourseList = await getCourses();
      courses.value = updatedCourseList.data;

      newCourse.value = { id: '', name: '', hours: '', experimentHours: '', description: '' };
    } else {
      ElMessage.error('添加课程失败');
    }
  } catch (error) {
    ElMessage.error(error.message);
  }
};

// 确认删除课程
const confirmDelete = async (course) => {
  try {
    const confirmed = await ElMessageBox.confirm('该操作将会删除该课程的信息和与之关联的所有信息，谨慎操作，是否确认？', '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    });

    if (confirmed === 'confirm') {
      const courseId = course.id;
      await deleteCourse(courseId);
      ElMessage.success('课程删除成功');

      const updatedCourseList = await getCourses();
      courses.value = updatedCourseList.data;
    }
  } catch (error) {
    // ElMessage.error(error.message);
  }
};
</script>

<style scoped>
.courseList {
  padding: 30px;
  background: #f7f8fc;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
}

.admin-tip {
  background-color: #d0d9f3;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.admin-tip-content {
  display: flex;
  align-items: center;
  font-size: 16px;
  color: #3c4b6e;
}

.admin-tip-icon {
  color: #5f77db;
  margin-right: 8px;
  font-size: 20px;
}

.admin-tip-text {
  font-weight: bold;
}

.addCourse {
  background: #fff;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.section-header {
  font-size: 18px;
  font-weight: bold;
  color: #4a4a4a;
  margin-bottom: 10px;
}

.section-description {
  font-size: 14px;
  color: #7a7a7a;
  margin-bottom: 20px;
}

.input-field {
  background-color: #f4f7fb;
  border-radius: 8px;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #e4e8f0;
  transition: border 0.3s ease;
}

.input-field:focus {
  border-color: #5C6BC0;
  box-shadow: 0 0 5px rgba(92, 107, 192, 0.5);
}

.add-button {
  background: linear-gradient(135deg, #4CAF50, #388E3C);
  color: white;
  font-weight: 600;
  border-radius: 8px;
  padding: 12px;
  font-size: 16px;
  width: 100%;
  transition: transform 0.3s ease, background 0.3s ease;
}

.add-button:hover {
  background: linear-gradient(135deg, #388E3C, #4CAF50);
  transform: translateY(-2px);
}

.courseTable {
  margin-top: 30px;
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.course-table .el-table__header {
  background-color: #f1f3f8;
  color: #6c6f75;
  font-weight: 600;
}

.course-table .el-table__header th {
  font-size: 14px;
}

.course-table .el-table__body tr:hover {
  background-color: #f7f8fc;
}

.delete-button {
  background-color: #e57373;
  color: white;
  font-weight: 600;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.delete-button:hover {
  background-color: #d32f2f;
}

.el-table {
  font-size: 14px;
}
</style>
