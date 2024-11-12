import './assets/main.css';

import { createApp } from 'vue';

import ArcoVue from '@arco-design/web-vue';
import App from './App.vue';

import '@arco-design/web-vue/dist/arco.css';

createApp(App).use(ArcoVue).mount('#app');
