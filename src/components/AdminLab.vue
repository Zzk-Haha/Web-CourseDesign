<template>
  <div class="labList">
    <!-- 管理员提示信息 -->
    <div class="admin-tip">
      <el-row>
        <el-col :span="24">
          <div class="admin-tip-content">
            <el-icon name="el-icon-info" class="admin-tip-icon" />
            <span class="admin-tip-text">欢迎来到实验室管理系统 - 管理员界面</span>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 添加实验室区域 -->
    <div class="addLab">
      <div class="section-header">
        <span>添加实验室</span>
      </div>
      <div class="section-description">
        请填写以下表单添加新实验室。
      </div>
      <el-row gutter="20">
        <el-col :span="6">
          <el-input v-model="newLab.id" placeholder="实验室ID" class="input-field" />
        </el-col>
        <el-col :span="6">
          <el-input v-model="newLab.name" placeholder="实验室名称" class="input-field" />
        </el-col>
        <el-col :span="6">
          <el-input v-model="newLab.staffId" placeholder="负责人ID" class="input-field" />
        </el-col>
        <el-col :span="6">
          <el-input v-model="newLab.capacity" placeholder="容量" class="input-field" />
        </el-col>
        <el-col :span="6">
          <el-input v-model="newLab.configuration" placeholder="配置" class="input-field" />
        </el-col>
        <!-- 状态字段改为下拉框 -->
        <el-col :span="6">
          <el-select v-model="newLab.status" placeholder="请选择状态" class="input-field">
            <el-option label="可用" value="Available" />
            <el-option label="不可用" value="NotAvailable" />
            <el-option label="正在维护" value="Maintenance" />
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="addNewLab" class="add-button">添加</el-button>
        </el-col>
      </el-row>
    </div>

    <!-- 实验室列表区域 -->
    <div class="labTable">
      <div class="section-header">
        <span>实验室列表</span>
      </div>
      <div class="section-description">
        这里展示所有已添加的实验室信息，您可以进行删除操作。
      </div>
      <el-table border :data="labs" class="lab-table">
        <el-table-column label="实验室名称" prop="name"></el-table-column>
        <el-table-column label="实验室ID" prop="id"></el-table-column>
        <el-table-column label="负责人ID" prop="staffId"></el-table-column>
        <el-table-column label="容量" prop="capacity"></el-table-column>
        <el-table-column label="配置" prop="configuration"></el-table-column>
        <el-table-column label="状态" prop="status">
          <template #default="scope">
            <span>{{ statusLabel(scope.row.status) }}</span>
          </template>
        </el-table-column>
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
import { getLabs, addLab, deleteLab } from '@/api/adminLab'
import { ElMessageBox, ElMessage } from 'element-plus'

const labs = ref([]);
const newLab = ref({
  id: '',
  name: '',
  staffId: '',
  capacity: '',
  configuration: '',
  status: ''
});

// 页面加载时获取实验室列表
onMounted(async () => {
  try {
    const labList = await getLabs();
    labs.value = labList.data;
    // console.log(JSON.stringify(labList.data))
  } catch (error) {
    ElMessage.error('获取实验室列表时出错：' + error.message);
  }
});

// 添加新实验室
const addNewLab = async () => {
  if (!newLab.value.id || !newLab.value.name || !newLab.value.staffId || !newLab.value.capacity || !newLab.value.configuration || !newLab.value.status) {
    ElMessage.warning('请填写所有必填信息');
    return;
  }

  const newLabData = {
    id: newLab.value.id,
    name: newLab.value.name,
    staffId: newLab.value.staffId,
    capacity: newLab.value.capacity,
    configuration: newLab.value.configuration,
    status: newLab.value.status
  };

  try {
    const response = await addLab(newLabData);

    if (response.code === 200) {
      ElMessage.success('实验室添加成功');
      const updatedLabList = await getLabs();
      labs.value = updatedLabList.data;

      newLab.value = { id: '', name: '', staffId: '', capacity: '', configuration: '', status: '' };
    } else {
      ElMessage.error('添加实验室失败,检查网络连接');
    }
  } catch (error) {
    ElMessage.error("添加失败，请检查实验室负责人是否存在!");
  }
};

// 确认删除实验室
const confirmDelete = async (lab) => {
  try {
    const confirmed = await ElMessageBox.confirm('该操作将会删除该实验室的信息和与之关联的所有信息，谨慎操作，是否确认？', '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    });

    if (confirmed === 'confirm') {
      const labId = lab.id;
      await deleteLab(labId);
      ElMessage.success('实验室删除成功');

      const updatedLabList = await getLabs();
      labs.value = updatedLabList.data;
    }
  } catch (error) {
    // ElMessage.error(error.message);
  }
};

// 显示状态对应的标签
const statusLabel = (status) => {
  switch (status) {
    case 'Available':
      return '可用';
    case 'NotAvailable':
      return '不可用';
    case 'Maintenance':
      return '正在维护';
    default:
      return '未知';
  }
};
</script>

<style scoped>
.labList {
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

.addLab {
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

.labTable {
  margin-top: 30px;
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.lab-table .el-table__header {
  background-color: #f1f3f8;
  color: #6c6f75;
  font-weight: 600;
}

.lab-table .el-table__header th {
  font-size: 14px;
}

.lab-table .el-table__body tr:hover {
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
  background-color:#e53935;
  transform: translateY(-2px);
}
</style>

