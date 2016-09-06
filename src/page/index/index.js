import Vue from 'vue'

var vm = new Vue({
	el: 'body',
	template: `
		<stage></stage>
	`,
	replace: false,
	components: {
		stage: require('./stage.vue')
	}
})