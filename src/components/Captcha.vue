<script setup>
import {defineProps, defineEmits, ref} from 'vue';

const props = defineProps({
  modelValue: String // 接收父组件传递的验证码值
});

const emit = defineEmits(['update:modelValue']); // 用于通知父组件更新值

const captchaText = ref('');

// 生成验证码
const generateCaptcha = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  captchaText.value = '';
  for (let i = 0; i < 6; i++) {
    captchaText.value += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  // 发射事件更新父组件的验证码
  emit('update:modelValue', captchaText.value);
};

// 页面加载时生成验证码
generateCaptcha();
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
