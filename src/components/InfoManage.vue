<template>
  <div class="info-manage">
      <!-- 固定顶部导航 -->
      <el-row class="info-header" :gutter="20">
        <el-col :span="24" class="welcome-message">
          <span>欢迎回来，{{ teacherInfo.name  }}</span>
        </el-col>
      </el-row>

      <!-- 主体内容区域 -->
      <div class="main-content">
        <el-card class="info-card">
          <el-row>
            <el-col :span="6" class="avatar-container">
              <img src="@/assets/img/avatar.jpg" alt="用户头像">
            </el-col>
            <el-col :span="18">
              <div class="info-item">
                <strong>工号：</strong>{{ teacherInfo.account }}
              </div>
              <div class="info-item">
                <strong>昵称：</strong>{{ teacherInfo.webName  }}
              </div>
              <div class="info-item">
                <strong>专业：</strong>{{ teacherInfo.major }}
              </div>
              <div class="info-item">
                <strong>邮箱：</strong>{{ teacherInfo.email }}
              </div>
              <div class="info-item">
                <strong>手机号：</strong>{{ teacherInfo.phone }}
              </div>
            </el-col>
          </el-row>
        </el-card>

        <!-- 编辑信息和修改密码按钮 -->
        <div class="action-buttons">
          <el-button type="success" @click="handleEditInfo" class="edit-info-btn">
            编辑信息
          </el-button>
          <el-button type="primary" @click="handleChangePassword" class="change-password-btn">
            修改密码
          </el-button>
        </div>

        <!-- 自定义编辑个人信息弹出框 -->
        <div v-if="isEditDialogVisible" class="custom-dialog-overlay" @click="closeDialog">
          <div class="custom-dialog" @click.stop>
            <div class="dialog-header">
              <span class="dialog-title">编辑个人信息</span>
              <button @click="closeDialog" class="dialog-close-btn">X</button>
            </div>
            <el-form :model="form" ref="formRef" label-width="80px">
              <el-form-item label="昵称" prop="name" :rules="nameRules">
                <el-input v-model="form.name" placeholder="请输入昵称"></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="email" :rules="emailRules">
                <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
              </el-form-item>
              <el-form-item label="电话" prop="phone" :rules="phoneRules">
                <el-input v-model="form.phone" placeholder="请输入电话"></el-input>
              </el-form-item>
            </el-form>
            <div class="dialog-footer">
              <el-button @click="closeDialog">取 消</el-button>
              <el-button type="primary" @click="submitInfoChange">确 定</el-button>
            </div>
          </div>
        </div>

        <!-- 自定义修改密码弹出框 -->
        <div v-if="isDialogVisible" class="custom-dialog-overlay" @click="closeDialog">
          <div class="custom-dialog" @click.stop>
            <div class="dialog-header">
              <span class="dialog-title">修改密码</span>
              <button @click="closeDialog" class="dialog-close-btn">X</button>
            </div>
            <el-form :model="form" ref="formRef" label-width="80px">
              <el-form-item label="新密码" prop="password" :rules="passwordRules" >
                <el-input v-model="form.password" type="password" placeholder="请输入新密码" required></el-input>
              </el-form-item>
              <el-form-item label="确认密码" prop="confirmPassword" :rules="confirmPasswordRules" >
                <el-input v-model="form.confirmPassword" type="password" placeholder="请确认新密码" required></el-input>
              </el-form-item>
            </el-form>
            <div class="dialog-footer">
              <el-button @click="closeDialog">取 消</el-button>
              <el-button type="primary" @click="submitPasswordChange">确 定</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>


</template>

<script setup>
import { ref, onMounted ,reactive} from 'vue';
import {ElRow, ElCol, ElCard, ElButton, ElForm, ElFormItem, ElInput, ElMessage} from 'element-plus';
import { postTeacherInfo, postUpdatePassword } from '@/api/teacher.js';

const teacherInfo = reactive({
  id: '',
  name: '',
  major: '',
  email: '',
  phone: '',
  avatar: '',
  account: '',
  webName: '',
});

const isDialogVisible = ref(false);
const isEditDialogVisible = ref(false);
const form = ref({
  password: '',
  confirmPassword: '',
  name: '',
  email: '',
  phone: ''
});

const nameRules = [{ required: true, message: '请输入姓名', trigger: 'blur' }];
const emailRules = [{ required: true, message: '请输入邮箱', trigger: 'blur' }];
const phoneRules = [{ required: true, message: '请输入电话', trigger: 'blur' }];

const passwordRules = {
  required: true,
  message: '请输入新密码',
  trigger: 'blur'
};

const confirmPasswordRules = [
  { required: true, message: '请确认新密码', trigger: 'blur' },
  { validator: validateConfirmPassword, trigger: 'blur' }
];

onMounted(() => {
  const storedUserData = localStorage.getItem('userData');
  if (storedUserData) {
    try {
      const parsedData = JSON.parse(storedUserData);
      Object.assign(teacherInfo, parsedData);
    } catch (error) {
      console.error('无法解析 localStorage 中的用户数据:', error);
    }
  }
});

function validateConfirmPassword(rule, value, callback) {
  if (value !== form.value.password) {
    callback(new Error('两次输入的密码不一致'));
  } else {
    callback();
  }
}

function handleEditInfo() {
  isEditDialogVisible.value = true;
}

// 修改个人信息
async function submitInfoChange() {



  if(form.value.name === '' || form.value.email === '' || form.value.phone === ''){
    ElMessage.error("信息均不能为空")
    return
  }
  // 更新 teacherInfo 后，vue 会自动重新渲染
    teacherInfo.webName = form.value.name;
    teacherInfo.email = form.value.email;
    teacherInfo.phone = form.value.phone;
  localStorage.setItem('userData', JSON.stringify(teacherInfo));


  try {
    const response = await postTeacherInfo(
        teacherInfo.account,
        form.value.name,
        form.value.email,
        form.value.phone,
    );

    if (response.code === 200) {
      ElMessage.success('个人信息更新成功');
    } else {
      ElMessage.error('更新失败，请稍后再试');
    }
  } catch (error) {
    alert('请求失败，请检查网络连接或稍后再试');
  }
  isEditDialogVisible.value = false;
}


function handleChangePassword() {
  isDialogVisible.value = true;
}

async function submitPasswordChange() {

  if(form.value.password == '' || form.value.confirmPassword == ''){
    ElMessage.error("密码不能为空");
    return;
  }

  if (form.value.password !== form.value.confirmPassword ) {
    ElMessage.error("两次输入的密码不一致");
    return;
  }


  try {
    const response = await postUpdatePassword(form.value.password);
    if (response.code === 200) {
      ElMessage.success('密码更新成功')
      // alert('密码更新成功');
    } else {
      // alert('密码更新失败');
      ElMessage.error('密码更新失败，请稍后再试')
    }
  } catch (error) {
    alert('请求失败，请稍后再试');
  }

  isDialogVisible.value = false;
}

function closeDialog() {
  isEditDialogVisible.value = false;
  isDialogVisible.value = false;
}
</script>

<style scoped>

/* 背景遮罩 */
.custom-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 弹出框样式 */
.custom-dialog {
  background-color: #fff;
  padding: 30px;
  border-radius: 12px;
  width: 480px;
  box-shadow: 0 6px 30px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
}

/* 弹出框头部 */
.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 10px;
}

.dialog-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.dialog-close-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #aaa;
  transition: color 0.3s;
}

.dialog-close-btn:hover {
  color: #409eff;
}

/* 底部按钮 */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
}

.el-form-item {
  margin-bottom: 20px;
  font-size: 16px;
}

/* 页面整体布局 */
.info-manage {
  padding: 40px;
  background-color: #f7f9fc;
  border-radius: 12px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  transition: background-color 0.3s ease;
}

/* 顶部欢迎信息 */
.welcome-message {
  font-size: 24px;
  font-weight: 600;
  text-align: center;
  color: #409eff;
  margin-bottom: 30px;
}

/* 主体内容区域 */
.main-content {
  flex-grow: 1;
  margin-top: 30px;
}
/* 个人信息卡片 */
.info-card {
  margin-bottom: 30px;
  border-radius: 12px;
  background-color: #fff;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 25px;
  display: flex;
  gap: 30px; /* 增加间距，拉远头像和文字描述 */
}

/* 头像容器 */
.avatar-container {
  text-align: center;
  width: 120px;
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f2f5;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto;
}

/* 文字描述容器 */
.info-item {
  font-size: 16px;
  margin-bottom: 16px;
  color: #666;
  line-height: 1.6;
}


/* 个人信息项 */
.info-item {
  font-size: 16px;
  margin-bottom: 16px;
  color: #666;
  line-height: 1.6;
}


.avatar-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 按钮容器 */
.action-buttons {
  display: flex;
  justify-content: center;
  gap: 30px;
}

/* 编辑信息按钮 */
.edit-info-btn,
.change-password-btn {
  display: inline-block;
  width: 160px;
  height: 45px;
  font-size: 16px;
  border-radius: 25px;
  text-align: center;
  transition: transform 0.3s ease, background-color 0.3s ease;
}

/* 编辑信息按钮 */
.edit-info-btn {
  background-color: #34c759;
  color: #fff;
  border-color: #34c759;
}

.edit-info-btn:hover {
  background-color: #28a745;
  border-color: #28a745;
  transform: translateY(-3px);
}

/* 修改密码按钮 */
.change-password-btn {
  background-color: #409eff;
  color: #fff;
  border-color: #409eff;
}

.change-password-btn:hover {
  background-color: #3188cc;
  border-color: #3188cc;
  transform: translateY(-3px);
}

/* 输入框样式 */
.el-input__inner {
  font-size: 16px;
  padding: 12px 15px;
  border-radius: 8px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  transition: border-color 0.3s ease;
}

.el-input__inner:focus {
  border-color: #409eff;
  box-shadow: 0 0 5px rgba(64, 158, 255, 0.2);
}

/* 表单项标签 */
.el-form-item__label {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

/* 适配大屏 */
@media (min-width: 1200px) {
  .info-manage {
    padding: 50px;
  }

  .info-card {
    flex-direction: row;
    padding: 30px;
  }

  .info-item {
    font-size: 18px;
    line-height: 1.8;
  }

  .action-buttons {
    gap: 40px;
  }

  .edit-info-btn,
  .change-password-btn {
    width: 180px;
    font-size: 18px;
  }
}


</style>
