<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import Captcha from './Captcha.vue';
import {ElMessage} from "element-plus";

const router = useRouter();

// 响应状态
const message = ref('');
const userData = ref(null); // 用于保存用户信息

// 表单数据
const account = ref('');
const password = ref('');
const captcha = ref('');
const realCaptcha = ref('');

// 处理登录
const handleLogin = async (event) => {
  event.preventDefault(); // 防止表单默认提交行为

  // 获取表单输入的账户和密码
  const account = event.target.account.value;
  const password = event.target.password.value;
  const captcha = event.target.captcha.value;

  // 校验验证码是否正确，假设验证码是必填的且不为空
  if (!captcha) {
    ElMessage.error('请输入验证码')
    return;
  }

  // 校验验证码是否正确
  if (captcha !== realCaptcha.value) {
    ElMessage.error('验证码错误')
    event.target.captcha.value = '' // 清空验证码输入框

    return;
  }

  try {
    // 向后端发送登录请求
    const response = await axios.post('http://localhost:8080/api/login', {
      account,
      password,
      captcha
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const reply = response.data
    if (reply.code === 200) {
      userData.value = response.data.data;
      // 登录成功时，保存用户信息到 localStorage
      localStorage.setItem('userData', JSON.stringify(userData.value));
      // 登录成功时，保存 token 和 role 到 localStorage
      localStorage.setItem('token', response.headers['token']);
      localStorage.setItem('role', response.headers['role']);
      ElMessage.success("教师登录成功")

      // 登录成功，跳转到教师首页
      router.push('/index');
    }
    else if (reply.code === 400){
      event.target.password.value = ''
      event.target.captcha.value = '' // 清空验证码输入框
      ElMessage.error(reply.msg)
    }
    else {
      // 登录失败，显示错误信息
      // message.value = response.data.message || '登录失败';
      ElMessage.value('登录失败,请检查网络连接')
    }
  } catch (error) {
    ElMessage.value('网络错误，请稍后再试')
    // message.value = '网络错误，请稍后再试';
  }
};

// 处理管理员登录
const handleAdminLogin = async (event) => {
  event.preventDefault(); // 防止表单默认提交行为

  // 校验验证码是否正确，假设验证码是必填的且不为空
  if (!captcha) {
    ElMessage.error('请输入验证码');
    // message.value = '请输入验证码';
    return;
  }
  // 校验验证码是否正确
  if (captcha.value !== realCaptcha.value) {
    // console.log("readCaptcha:"+ realCaptcha.value)
    // console.log("captcha:"+ captcha.value)
    ElMessage.error('验证码错误')
    event.target.captcha.value = '' // 清空验证码输入框
    return;
  }

  try {
    // 向后端发送管理员登录请求
    const response = await axios.post('http://localhost:8080/api/login', {
      account: account.value,
      password: password.value,
      captcha: captcha.value
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const reply = response.data

    if (reply.code === 200) {
      // 登录成功，保存管理员信息
      userData.value = response.data.data; // 保存管理员信息
      localStorage.setItem('userData', JSON.stringify(userData.value));
      localStorage.setItem('token', response.headers['token']); // 保存 token
      localStorage.setItem('role', response.headers['role']); // 保存 role

      ElMessage.success("管理员登录成功")
      // 跳转到管理员首页
      router.push('/adminmanage');
    }
    else if(reply.code === 400) {
      console.log(reply.msg)
      ElMessage.error(reply.msg)

    }
    else{
      // 登录失败，显示错误信息
      // message.value = response.data.message || '登录失败';
      ElMessage.error( '登录失败,请检查网络连接')
    }
  } catch (error) {
    // message.value = '网络错误，请稍后再试';
    ElMessage.error('网络错误，请稍后再试')
  }
};
</script>

<template>
  <div id="container">
    <form @submit="handleLogin">
      <div class="container">
        <div class="box">
          <h2>登录</h2>
          <input type="text" placeholder="Account" name="account" v-model="account" required/>
          <input type="password" placeholder="Password" name="password" v-model="password" required/>

          <!-- 验证码输入框 -->
          <div class="captcha-container">
            <Captcha v-model="realCaptcha" /> <!-- 使用v-model绑定 realCaptcha -->
            <input type="text" placeholder="Enter Captcha" name="captcha" v-model="captcha" required/>
          </div>

          <!-- 教师登录按钮 -->
          <button class="log" type="submit">教师登录</button>

          <!-- 管理员登录按钮，绑定了单独的点击事件 -->
          <button class="admin-log" type="button" @click="handleAdminLogin">管理员登录</button>

          <br>
          <!-- 错误提示信息 -->
          <div id="message" v-if="message" style="color: red; font-weight: bold; font-size: 20px; text-align: center">
            {{ message }}
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped>
/* 背景设置 */
#container {
  background-image: url("@/assets/img/back.png");
  background-size: cover;
  background-position: center;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden; /* 禁止滚动 */
}

/* 登录框样式 */
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.box {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 400px;
  padding: 30px;
  border-radius: 16px;
  background: rgba(0, 0, 0, 0.8); /* 深色背景 */
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4), 0 4px 15px rgba(0, 0, 0, 0.3); /* 更深的阴影 */
  backdrop-filter: blur(12px); /* 增强模糊效果，营造更强的层次感 */
}

h2 {
  font-family: 'Arial', sans-serif;
  font-size: 32px;
  color: #ecf0f1; /* 浅灰白色字体 */
  margin-bottom: 20px;
  font-weight: 700;
  text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.3); /* 添加文字阴影 */
}

.box input {
  width: 100%;
  padding: 14px;
  margin: 10px 0;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.4); /* 半透明边框 */
  font-size: 16px;
  background-color: rgba(255, 255, 255, 0.1); /* 透明的输入框背景 */
  color: #ecf0f1; /* 浅灰白色字体 */
  box-sizing: border-box;
  transition: all 0.3s ease-in-out;
}

.box input:focus {
  border-color: #34495e; /* 深灰色边框 */
  outline: none;
  background-color: rgba(255, 255, 255, 0.2); /* 聚焦时输入框背景变亮 */
}

/* 登录按钮样式 */
.log {
  width: 100%;
  padding: 14px;
  font-size: 18px;
  color: #fff; /* 白色文字 */
  background: linear-gradient(135deg, #1e2d24, #34495e); /* 深绿色到深灰色渐变 */
  border: none;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.log:hover {
  background: linear-gradient(135deg, #34495e, #1e2d24); /* 悬停时渐变效果反转 */
  transform: translateY(-2px); /* 微调位置 */
}

.admin-log {
  width: 100%;
  padding: 14px;
  font-size: 18px;
  color: #fff; /* 白色文字 */
  background-color: #2c3e50; /* 深蓝色 */
  border: none;
  border-radius: 12px;
  cursor: pointer;
  margin-top: 10px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.admin-log:hover {
  background-color: #34495e; /* 深蓝色加深 */
  transform: translateY(-2px); /* 微调位置 */
}


/* 验证码输入框 */
.captcha-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.captcha-container input {
  width: 60%;
  padding: 10px;
  background: rgba(255, 255, 255, 0.1); /* 输入框透明背景 */
  border-radius: 8px;
  color: #ecf0f1; /* 浅灰白色字体 */
  border: 1px solid rgba(255, 255, 255, 0.4); /* 半透明边框 */
  box-sizing: border-box;
}

.captcha-container input:focus {
  border-color: #34495e; /* 聚焦时深灰色边框 */
}

/* 响应式设计 */
@media (max-width: 768px) {
  .box {
    width: 90%;
    padding: 20px;
  }

  .log, .admin-log {
    font-size: 16px;
  }

  .captcha-container input {
    width: 45%;
  }
}

</style>

