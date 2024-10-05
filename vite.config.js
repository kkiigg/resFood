import {
	defineConfig
} from 'vite'
import uni from '@dcloudio/vite-plugin-uni' // 引用官方插件

export default defineConfig({
	plugins: [
		uni()
	],
	server: {
		proxy: {
			'/ForwardORDER': {
				target: 'http://3lb79528nz34.vicp.fun', // 目标服务  
				changeOrigin: true,
			}
		}
	}
})