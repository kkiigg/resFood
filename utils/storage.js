export const getStorageJson = (key) => {
	const str = uni.getStorageSync('currOrderObj')
	if (str) {
		return JSON.parse(str)
	} else {
		return null
	}

}
// export const setStorageJson = (key, val) => ({

// })