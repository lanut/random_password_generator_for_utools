import {createApp} from "vue";
import "./main.css";
import App from "./App.vue";

// 在 Vue 的入口文件（如 src/main.js）或组件中
const checkDarkMode = () => {
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.classList.toggle('dark', isDark);
};

// 初始化检测
checkDarkMode();

// 监听系统主题变化
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', checkDarkMode);

createApp(App).mount("#app");