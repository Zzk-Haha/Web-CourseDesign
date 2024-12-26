<template>
  <div class="teacherList">
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

    <!-- 添加教师区域 -->
    <div class="addTeacher">
      <div class="section-header">
        <span>添加教师</span>
      </div>
      <div class="section-description">
        请填写以下表单添加新教师。
      </div>
      <el-row gutter="20">
        <el-col :span="6">
          <el-input v-model="newTeacher.account" placeholder="教师工号" class="input-field" />
        </el-col>
        <el-col :span="6">
          <el-input v-model="newTeacher.major" placeholder="教师专业" class="input-field" />
        </el-col>
        <el-col :span="6">
          <el-input v-model="newTeacher.phone" placeholder="教师联系电话" class="input-field" />
        </el-col>
        <el-col :span="6">
          <el-input v-model="newTeacher.name" placeholder="教师姓名" class="input-field" />
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="addNewTeacher" class="add-button">添加</el-button>
        </el-col>
      </el-row>
    </div>

    <!-- 教师列表区域 -->
    <div class="teacherTable">
      <div class="section-header">
        <span>教师列表</span>
      </div>
      <div class="section-description">
        这里展示所有已添加的教师信息，您可以进行删除操作。
      </div>
      <el-table border :data="teachers" class="teacher-table">
        <el-table-column label="教师姓名" prop="name"></el-table-column>
        <el-table-column label="教师工号" prop="account"></el-table-column>
        <el-table-column label="教师专业" prop="major"></el-table-column>
        <el-table-column label="教师联系电话" prop="phone"></el-table-column>
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
import { getTeachers, addTeacher, deleteTeacher } from '@/api/admin'
import { ElMessageBox, ElMessage } from 'element-plus'

const teachers = ref([]);
const newTeacher = ref({
  account: '',
  major: '',
  phone: '',
  name: ''
});

// 页面加载时获取教师列表
onMounted(async () => {
  try {
    const teacherList = await getTeachers();
    teachers.value = teacherList.data;
  } catch (error) {
    ElMessage.error('获取教师列表时出错：' + error.message);
  }
});

// 添加新教师
const addNewTeacher = async () => {
  if (!newTeacher.value.account || !newTeacher.value.major || !newTeacher.value.phone || !newTeacher.value.name) {
    ElMessage.warning('请填写所有必填信息');
    return;
  }

  const newTeacherData = {
    account: newTeacher.value.account,
    major: newTeacher.value.major,
    phone: newTeacher.value.phone,
    name: newTeacher.value.name
  };

  try {
    const response = await addTeacher(newTeacherData);

    if (response.code === 200) {
      ElMessage.success('教师添加成功');
      const updatedTeacherList = await getTeachers();
      teachers.value = updatedTeacherList.data;

      newTeacher.value = { account: '', major: '', phone: '', name: '' };
    } else {
      ElMessage.error('添加教师失败');
    }
  } catch (error) {
    ElMessage.error(error.message);
  }
};

// 确认删除教师
const confirmDelete = async (teacher) => {
  try {
    const confirmed = await ElMessageBox.confirm('该操作将会删除该教师的信息和所有关联信息，是否确认？', '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    });

    if (confirmed === 'confirm') {
      const account = teacher.account;
      await deleteTeacher(account);
      ElMessage.success('教师删除成功');

      const updatedTeacherList = await getTeachers();
      teachers.value = updatedTeacherList.data;
    }
  } catch (error) {
    // ElMessage.error(error.message);
  }
};
</script>

<style scoped>
.teacherList {
  padding: 30px;
  background: #f7f8fc;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
}

.admin-tip {
  background-color: #d0d9f3;  /* 淡蓝色背景 */
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

.addTeacher {
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

.teacherTable {
  margin-top: 30px;
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.teacher-table .el-table__header {
  background-color: #f1f3f8;
  color: #6c6f75;
  font-weight: 600;
}

.teacher-table .el-table__header th {
  font-size: 14px;
}

.teacher-table .el-table__body tr:hover {
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
