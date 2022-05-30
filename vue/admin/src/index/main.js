import { createApp } from 'vue'
import App from './App.vue'
import api from "../../../../app/api/api_desc"

const app = createApp(App);

app.config.globalProperties.$api = api

app.provide('$api', app.config.globalProperties.$api)

app.mount('#app')
