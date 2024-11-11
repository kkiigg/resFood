// // #ifndef VUE3
// import Vue from 'vue'
// import App from './App'
// import '@/common/style/common.scss'; 

// Vue.config.productionTip = false

// App.mpType = 'app'

// const app = new Vue({
//     ...App
// })
// app.$mount()
// // #endif

// // #ifdef VUE3
// import { createSSRApp } from 'vue'
// import App from './App.vue'
// import store from './store'
// import '@/common/style/common.scss'; 

// export function createApp() {
//   const app = createSSRApp(App)
//   app.use(store)
//   return {
//     app,
//   }
// }
// // #endif


import App from './App.vue'
import '@/common/style/common.scss';

// #ifndef VUE3
import Vue from 'vue'
import store from './store'
Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue({
	store,
	...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
import store from './store'

export function createApp() {
	const app = createSSRApp(App)
	app.use(store)
	return {
		app,

	}
}
// #endif