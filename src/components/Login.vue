<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import Captcha from './Captcha.vue';
import {ca} from "element-plus/es/locale/index";

const router = useRouter();

// 响应状态
const message = ref('');
const userData = ref(null); // 用于保存用户信息

// 表单数据
const account = ref('');
const password = ref('');
const captcha = ref('');


const handleLogin = async (event) => {
  event.preventDefault(); // 防止表单默认提交行为

  // 获取表单输入的账户和密码
  const account = event.target.account.value;
  const password = event.target.password.value;
  const captcha = event.target.captcha.value;

  // 校验验证码是否正确，假设验证码是必填的且不为空
  if (!captcha) {
    message.value = '请输入验证码';
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


    if (response.data.code === 200) {
      userData.value = response.data.data;
      // 登录成功时，保存 token 和 role 到 localStorage
      localStorage.setItem('token', response.headers['token']);
      localStorage.setItem('role', response.headers['role']);

      // 打印日志，确认 token 是否已正确保存
      console.log("token:", response.headers['token']);
      console.log("role:", response.headers['role']);
      console.log(userData.value)

      // 将用户信息保存到localStorage
      localStorage.setItem('userData', JSON.stringify(userData.value));


      // 登录成功，跳转到教师首页
      router.push('/index');
    } else {
      // 登录失败，显示错误信息
      message.value = response.data.message || '登录失败';
    }
  } catch (error) {

    message.value = '网络错误，请稍后再试';
  }
};

const handleAdminLogin = async (event) => {
  event.preventDefault(); // 防止表单默认提交行为

  // 校验验证码是否正确，假设验证码是必填的且不为空
  if (!captcha) {
    message.value = '请输入验证码';
    return;
  }

  try {
    // 向后端发送管理员登录请求
    const response = await axios.post('http://localhost:8080/api/login', {
      account:account.value,
      password:password.value,
      captcha:captcha.value

    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });


    if (response.data.code === 200) {
      // 登录成功，保存管理员信息
      userData.value = response.data.data; // 保存管理员信息
      localStorage.setItem('token',  response.headers['token']); // 保存 token
      localStorage.setItem('role',  response.headers['role']); // 保存 role

      // console.log(userData.value)

      // 跳转到管理员首页
      router.push('/adminmanage');
    } else {
      // 登录失败，显示错误信息
      message.value = response.data.message || '登录失败';
    }
  } catch (error) {
    message.value = '网络错误，请稍后再试';
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
            <Captcha/>
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
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.85);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
}

h2 {
  font-family: 'Arial', sans-serif;
  font-size: 28px;
  color: #333;
  margin-bottom: 20px;
}

.box input {
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 16px;
  box-sizing: border-box;
}

.box input:focus {
  border-color: #007bff;
  outline: none;
}

.log {
  width: 100%;
  padding: 12px;
  font-size: 18px;
  background: linear-gradient(to right, #74b9ff, #adcfff);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;
}

.log:hover {
  background: linear-gradient(to right, #62a8ea, #74b9ff);
}

.admin-log {
  width: 100%;
  padding: 12px;
  font-size: 18px;
  background-color: #28a745;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;
}

.admin-log:hover {
  background-color: #218838;
}

/* 注册链接样式 */
.box a {
  color: #007bff;
  text-decoration: none;
  font-size: 16px;
}

.box a:hover {
  text-decoration: underline;
}

.captcha-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.captcha-container input {
  width: 60%;
}

@media (max-width: 768px) {
  .box {
    width: 100%;
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