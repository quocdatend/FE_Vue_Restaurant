import { createApp } from 'vue'
import App from './App.vue'
import vue3StarRatings from 'vue3-star-ratings';


import router from './router';
import { createPinia } from 'pinia';
import './assets/main.css';

const app = createApp(App);
app.use(router);
app.use(createPinia());
app.component('vue3-star-ratings', vue3StarRatings);
app.mount('#app');
