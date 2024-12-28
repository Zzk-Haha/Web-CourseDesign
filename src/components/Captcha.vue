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
    <button type="button" @click="generateCaptcha" class="refresh-btn">
      <!-- Material Design Refresh Icon -->
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
        <path d="M12 4V1l-3 3 3 3V6c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6h2c0 2.21 1.79 4 4 4s4-1.79 4-4-1.79-4-4-4z"/>
      </svg>
    </button>
  </div>
</template>

<style scoped>
.captcha {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.1); /* 半透明背景 */
  padding: 10px;
  border-radius: 12px;
  backdrop-filter: blur(8px); /* 背景模糊效果，提升现代感 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* 轻微阴影提升立体感 */
}

.captcha-text {
  font-size: 24px;
  font-weight: bold;
  color: #f5f5f5; /* 亮色字体与背景对比鲜明 */
  background-color: rgba(0, 0, 0, 0.3); /* 深色背景，更符合整体风格 */
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* 阴影提升层次感 */
}

.refresh-btn {
  background: linear-gradient(135deg, #3b4d52, #2f3b40); /* 默认背景色渐变 */
  border: none;
  border-radius: 50%; /* 圆形按钮 */
  cursor: pointer;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 12px; /* 增加按钮内边距，保持圆形 */
  transition: transform 0.3s ease, background-color 0.3s ease, padding 0.3s ease;
  font-size: 24px; /* 调整按钮的大小 */
}

.refresh-btn svg {
  width: 24px;
  height: 24px;
  fill: #9b59b6; /* 设置图标颜色为紫色 */
  transition: fill 0.3s ease, transform 0.3s ease;
}

.refresh-btn:hover svg {
  fill: #7a4e99; /* 悬停时图标颜色变深 */
  transform: rotate(360deg); /* 图标旋转 */
}

.refresh-btn:hover {
  background: linear-gradient(135deg, #4b6167, #3b4d52); /* 悬浮时渐变色加深 */
  padding: 10px; /* 悬浮时增大内边距，使按钮看起来更大 */
}


</style>
