import Vue from 'vue'

Vue.filter('number', val => {
	if (!val) return 0
	if (Number.isInteger(val)) {
		let rgx = /(\d)(?=(\d{3})+(?!\d))/g
		return val.toString().replace(rgx, '$1,')
	}
	return `${val}%`
})
