/** @fileoverview Bootstraps Vuetify and other plugins then mounts the App */

import { registerPlugins } from '@/plugins';

import App from './App.vue';

import { createApp } from 'vue';

import 'vue3-toastify/dist/index.css';
import '@/assets/flag-icons/css/flag-icons.min.css';

const app = createApp(App);

registerPlugins(app);

app.mount('#app');
