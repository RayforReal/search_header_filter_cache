import Vue from "vue";
import App from "./App.vue";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);
Vue.config.productionTip = false;
// 导入组件库
import searchHeader from './../packages/index'
// 注册组件库
Vue.use(searchHeader);

new Vue({
    render: h => h(App)
}).$mount("#app");
