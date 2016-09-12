<style lang="stylus">
	.game{
		//opacity: .1;
		max-width: 400px;
		margin-left: auto;
		margin-right: auto;
		background: #E3E3E3;
		overflow: hidden;

		.main{
			float left;
		}

		.side{
			width 100px;
			height 100%;
			float right;
			position relative;
		}

		.handles{
			height 120px;
			position absolute;
			bottom 10px;
		}
	}
</style>

<template>
	<div class="game">

		<chessboard class="main" v-ref:chessboard
			:col="col" :row="row" :current="current" :start="start">
		</chessboard>

		<div class="side">

			<chessboard v-ref:preview 
				:col="3" :row="3" :current="preview">
			</chessboard>

			<score :score="score"></score>

			<handles class="handles" v-ref:handles 
				:status="status">
			</handles>

		</div>
	</div>
</template>

<script>
	import Shape from './shape.js'
	import { css } from '../lib/dom.js'
	import interval from '../lib/interval.js'

	export default {
		data: function(){
			return {
				cellWidth: 20,
				width: 0,
				height: 0,
				start: [0, 0],
				status: 'stop',
				shapeWidth: 3,
				current: null,
				preview: null,
				score: 0,
				timer: null,
				dropTime: 500
			};
		},
		components: {
			chessboard: require('./chessboard.vue'),
			score: require('./score.vue'),
			handles: require('./handles.vue'),
		},
		methods: {

			// 计算画布尺寸：格子的数量
			size: function(){
				var doc = document.documentElement;

				this.width = Math.min(doc.clientWidth, 400) - 20 - 100;
				this.height = doc.clientHeight;

				this.col = Math.floor(this.width/(this.cellWidth + 2));
				this.row = Math.floor(this.height/(this.cellWidth + 1));

				// 计算形状出现的起始位置
				this.start = [
					Math.floor(this.col/2) - Math.floor(this.shapeWidth/2), 
					-this.shapeWidth
				];
			},

			// 显示表格
			render: function(){
				css('.game', {
					height: this.height + 'px',
				});
				css('.main', {
					height: (this.height - 20) + 'px',
					width: this.width + 'px',
				});
			},

			// 创建形状
			add: function(){
				this.current = this.preview || Shape.random();
				this.$refs.preview.reset();
				this.preview = Shape.random();
			},

			// 立即开始
			restart: function(){
				this.status = 'playing';
				this.add();
			}

		},

		created: function(){
			this.size();
		},

		//
		ready: function(){
			var vm = this,
				handles = vm.$refs.handles,
				chessboard = vm.$refs.chessboard;

			// 显示表格
			vm.render();

			// 重力作用
			vm.timer = interval(function(){
				if(vm.status === 'playing'){
					chessboard.drop();
				};
			}, vm.dropTime);

			// shape停止后添加新的
			chessboard.$on('stop', function(shape){
				vm.add();
				vm.timer.time = vm.dropTime;
			});
			// 计分
			chessboard.$on('score', function(times){
				vm.score += vm.col * times;
			});

			// 手柄
			handles.$on('move', function(d){
				chessboard.move(d);
				// 没按一次向下按钮，就加速20%
				if(d == 'down'){
					vm.timer.time -= vm.timer.time*0.2;
				};
			});
			handles.$on('roate', function(){
				chessboard.roate();
			});
			handles.$on('suspend', function(){
				if(vm.status === 'playing'){
					vm.status = 'suspend';
				};
			});
			handles.$on('resume', function(){
				vm.status = 'playing';
			});

			// 立即开始
			vm.restart();
		}
	};
</script>