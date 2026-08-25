import { createApp } from 'vue'
import './style.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import App from './App.vue'
import router from './router'

console.log('🔴 main.ts загружен!')

const app = createApp(App)

console.log('🔴 Подключаем роутер...')
app.use(router)

console.log('🔴 Монтируем приложение...')
app.mount('#app')

console.log('🔴 App смонтирован!')