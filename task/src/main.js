import App from './App.vue'

// Composables
import { createApp } from 'vue'

// Plugins
import { registerPlugins } from '@/plugins'
import axios from 'axios'
import store from './store'
import AOS from 'aos'
import 'aos/dist/aos.css' 



const app = createApp(App)
AOS.init()
axios.defaults.baseURL='http://localhost:3000/api'
app.use(store)
registerPlugins(app)
app.use(AOS)
app.mount('#app')
