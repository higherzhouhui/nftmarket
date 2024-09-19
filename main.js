import Vue from "vue";
import App from "./App";
import * as filters from "./utils/filters.js"; // global filter
import uView from "uview-ui";
import store from "./store";
import config from '@/config/config';
import airBtn from "@/components/m-airbtn/index.vue";

import VueI18n from 'vue-i18n'
import messages from '@/locale/index.js'
/**
 * 仅在h5中显示唤醒app功能
 * 在h5页面手动挂载
 * 
 */
// #ifdef H5
if (config.enableMiniBarStartUpApp) {
  let btn = Vue.component("airBtn", airBtn); //全局注册
  document.body.appendChild(new btn().$mount().$el);
}
// #endif

// 引入uView对小程序分享的mixin封装
let mpShare = require('uview-ui/libs/mixin/mpShare.js');
Vue.mixin(mpShare)

/**
 * 全局filters
 */

Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key]);
});
// 引入Vuex
Vue.prototype.$store = store;
Vue.use(uView);
Vue.config.productionTip = false;
// 国际化
const i18nConfig = {
	locale: uni.getStorageSync('lang') == 'en' ? 'en' : 'zh-Hans',
	messages
}
Vue.use(VueI18n)
const i18n = new VueI18n(i18nConfig)
/**
 * 注意！
 * 此处将常用的颜色嵌入到原型链上面
 * 颜色使用驼峰命名对应 uni.scss中全局颜色变量名
 * 如需更换主题请修改此处以及uni.scss中的全局颜色
 */
// 主题色
Vue.prototype.$mainColor = config.mainColor;
// 高亮主题色
Vue.prototype.$lightColor = config.lightColor;
// 辅助高亮颜色
Vue.prototype.$aiderLightColor = config.aiderLightColor;
Vue.prototype.$customI18n = i18n;



App.mpType = "app";
const app = new Vue({
	i18n,
  ...App,
});
app.$mount();
