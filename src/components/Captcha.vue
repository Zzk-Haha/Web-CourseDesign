<script setup>
import { ref } from 'vue';

const captchaText = ref('');

const generateCaptcha = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  captchaText.value = '';
  for (let i = 0; i < 6; i++) {
    captchaText.value += characters.charAt(Math.floor(Math.random() * characters.length));
  }
};

generateCaptcha(); // 页面加载时生成验证码

</script>

<template>
  <div class="captcha">
    <span class="captcha-text">{{ captchaText }}</span>
    <button type="button" @click="generateCaptcha" class="refresh-btn">🔄</button>
  </div>
</template>

<style scoped>
.captcha {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.captcha-text {
  font-size: 22px;
  font-weight: bold;
  color: #333;
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 5px;
}

.refresh-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}
</style>
