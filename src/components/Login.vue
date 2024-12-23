<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import Captcha from './Captcha.vue';

const router = useRouter();

const handleLogin = (event) => {
  event.preventDefault(); // 防止表单默认提交行为

  // 在这里可以添加验证逻辑（例如，检查账户和密码是否正确）
  // 假设验证通过，我们就进行跳转

  // 这里决定是跳转到教师页面还是管理员页面
  router.push('/index'); // 跳转到教师首页
};

const handleAdminLogin = (event) => {
  event.preventDefault(); // 防止表单默认提交行为

  // 假设管理员的验证通过后，跳转到管理员的首页
  router.push('/manageindex'); // 跳转到管理员页面
};
</script>

<template>
  <div id="container">
    <form @submit="handleLogin">
      <div class="container">
        <div class="box">
          <h2>登录</h2>
          <input type="text" placeholder="Account" name="account" required />
          <input type="password" placeholder="Password" name="password" required />

          <!-- 验证码输入框 -->
          <div class="captcha-container">
            <Captcha />
            <input type="text" placeholder="Enter Captcha" name="captcha" required />
          </div>

          <!-- 教师登录按钮 -->
          <button class="log" type="submit">教师登录</button>

          <!-- 管理员登录按钮，绑定了单独的点击事件 -->
          <button class="admin-log" type="button" @click="handleAdminLogin">管理员登录</button>

          <br>
          <div id="message" style="display: none; color: red; font-weight: bold;font-size: 20px;text-align: center">${message}</div>
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
}

/* 登录框样式 */
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
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
