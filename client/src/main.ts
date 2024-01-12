/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins';

// Components
import App from './App.vue';

// Composables
import { createApp } from 'vue';

// Styles
import 'vue3-toastify/dist/index.css';
import '@/assets/flag-icons/css/flag-icons.min.css';

const app = createApp(App);

registerPlugins(app);

app.mount('#app');
