import Vue from 'vue'

var vm = new Vue({
	el: 'body',
	template: `
		<game></game>
	`,
	replace: false,
	components: {
		game: require('../../components/game.vue')
	}
})