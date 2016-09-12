import Vue from 'vue'

var vm = new Vue({
	el: 'body',
	template: `
		<tetris></tetris>
	`,
	replace: false,
	components: {
		tetris: require('../../components/tetris.vue')
	}
})