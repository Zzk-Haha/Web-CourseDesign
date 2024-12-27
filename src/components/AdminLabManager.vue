<template>
  <div class="labManagerList">
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

    <!-- 添加实验室负责人区域 -->
    <div class="addLabManager">
      <div class="section-header">
        <span>添加实验室负责人</span>
      </div>
      <div class="section-description">
        请填写以下表单添加新的实验室负责人。
      </div>
      <el-row gutter="20">
        <el-col :span="6">
          <el-input v-model="newLabManager.id" placeholder="管理员工号" class="input-field" />
        </el-col>
        <el-col :span="6">
          <el-input v-model="newLabManager.name" placeholder="管理员姓名" class="input-field" />
        </el-col>
        <el-col :span="6">
          <el-input v-model="newLabManager.email" placeholder="管理员邮箱" class="input-field" />
        </el-col>
        <el-col :span="6">
          <el-input v-model="newLabManager.position" placeholder="职位" class="input-field" />
        </el-col>
        <el-col :span="6">
          <el-input v-model="newLabManager.phone" placeholder="管理员联系电话" class="input-field" />
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="addNewLabManager" class="add-button">添加</el-button>
        </el-col>
      </el-row>
    </div>

    <!-- 实验室负责人列表区域 -->
    <div class="labManagerTable">
      <div class="section-header">
        <span>实验室负责人列表</span>
      </div>
      <div class="section-description">
        这里展示所有已添加的实验室负责人信息，您可以进行删除操作。
      </div>
      <el-table border :data="labManagers" class="lab-manager-table">
        <el-table-column label="负责人姓名" prop="name"></el-table-column>
        <el-table-column label="负责人工号" prop="id"></el-table-column>
        <el-table-column label="管理员邮箱" prop="email"></el-table-column>
        <el-table-column label="职位" prop="position"></el-table-column>
        <el-table-column label="联系电话" prop="phone"></el-table-column>
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
import { getLabManager, addLabManager, deleteLabManager } from '@/api/adminLabManager'
import { ElMessageBox, ElMessage } from 'element-plus'

const labManagers = ref([]);  // 存储实验室负责人列表
const newLabManager = ref({
  id: '',
  name: '',
  email: '',
  position: '',
  phone: ''
});

// 页面加载时获取实验室负责人列表
onMounted(async () => {
  try {
    const managerList = await getLabManager();
    labManagers.value = managerList.data;
  } catch (error) {
    ElMessage.error('获取实验室负责人列表时出错：' + error.message);
  }
});

// 添加新的实验室负责人
const addNewLabManager = async () => {
  if (!newLabManager.value.id || !newLabManager.value.name || !newLabManager.value.email || !newLabManager.value.position || !newLabManager.value.phone) {
    ElMessage.warning('请填写所有必填信息');
    return;
  }

  const newLabManagerData = {
    id: newLabManager.value.id,
    name: newLabManager.value.name,
    email: newLabManager.value.email,
    position: newLabManager.value.position,
    phone: newLabManager.value.phone,
  };

  try {
    const response = await addLabManager(newLabManagerData);

    if (response.code === 200) {
      ElMessage.success('实验室管负责人添加成功');
      const updatedManagerList = await getLabManager();
      labManagers.value = updatedManagerList.data;

      // 清空表单
      newLabManager.value = { id: '', name: '', email: '', position: '', phone: '' };
    } else {
      ElMessage.error('添加实验室负责人失败');
    }
  } catch (error) {
    ElMessage.error(error.message);
  }
};

// 确认删除实验室负责人
const confirmDelete = async (manager) => {
  try {
    const confirmed = await ElMessageBox.confirm('该操作将会删除该实验室负责人的信息和所有关联信息，谨慎操作，是否确认？', '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    });

    if (confirmed === 'confirm') {
      const managerId = manager.id;
      await deleteLabManager(managerId);
      ElMessage.success('实验室负责人删除成功');

      const updatedManagerList = await getLabManager();
      labManagers.value = updatedManagerList.data;
    }
  } catch (error) {
    // ElMessage.error(error.message);
  }
};
</script>

<style scoped>
.labManagerList {
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

.addLabManager {
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

.labManagerTable {
  margin-top: 30px;
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.lab-manager-table .el-table__header {
  background-color: #f1f3f8;
  color: #6c6f75;
  font-weight: 600;
}

.lab-manager-table .el-table__header th {
  font-size: 14px;
}

.lab-manager-table .el-table__body tr:hover {
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

