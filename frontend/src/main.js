import { createApp } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import App from './App.vue'
import './assets/css/main.css'

const app = createApp(App)
app.component('apexchart', VueApexCharts)
app.mount('#app')
