import Buefy from 'buefy'
import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './App.vue'
import './index.css'
import { router } from './router'

const pinia = createPinia()
const app = createApp(App)

app.use(router)
app.use(pinia)
app.use(Buefy)

app.mount('#app')
