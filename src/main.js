import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import vuetyped from 'vue3typed'
import "element-plus/dist/index.css"
import 'element-plus/theme-chalk/display.css'
import "element-plus/theme-chalk/dark/css-vars.css"
import zhCn from "element-plus/es/locale/lang/zh-cn"
import App from './App.vue'
import router from './router'
import { useDark } from "@vueuse/core"
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import vue3Cookies from 'vue3-cookies'
import { createPinia } from 'pinia'
const app = createApp(App)
const pinia = createPinia()
const isDark = useDark()
if (isDark.value) {
    document.body.classList.add("dark")
}
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(router)
app.use(ElementPlus, {
    locale: zhCn
})
app.use(pinia)
app.use(vue3Cookies)
app.use(vuetyped)

app.mount('#app')
