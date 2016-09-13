<style lang="stylus">
	.game{
		//opacity: .1;
		max-width: 400px;
		margin-left: auto;
		margin-right: auto;
		background: #E3E3E3;
		overflow: hidden;
		position: relative;

		.main{
			float left;
		}

		.side{
			width 100px;
			height 100%;
			float right;
			position relative;

			.play{
				width: 65px;
				padding: 5px 0;
				border: 1px solid #999;
				margin: 20px auto 0 auto;
				border-radius: 3px;
				text-align: center;
				color: #999;
				background: #FFF;
				
			}
		}

		.handles{
			height 150px;
			width 100%;
			position: absolute;
			bottom: 0;
			left: 0;
		}

		.msg{
			position: absolute;
			width: 100%;
			height: 100%;
			text-align: center;
			background: #CCC;
			opacity: .8;
			z-index: 10;

			span{
				display: inline-block;
				padding: 20px;
				width: 50%;
				margin: 200px auto;
				font-size: 20px;
				background: #FFF;
				border-radius: 5px;
			}
		}
	}
</style>

<template>
	<!-- 容器 -->
	<div class="game">
		
		<!-- 主界面 -->
		<chessboard class="main" v-ref:chessboard
			:col="col" :row="row" :current="current" :start="startOffset">
		</chessboard>
		
		<!-- 侧面 -->
		<div class="side">
			
			<!-- 预览小窗口 -->
			<chessboard v-ref:preview 
				:col="3" :row="3" :current="preview">
			</chessboard>
			
			<!-- 成绩 -->
			<score :score="score"></score>
			
			<!-- 暂停 -->
			<div class="play" v-show="status === 'playing'">
				<div class="suspend">暂停</div>
			</div>

		</div>
		
		<!-- 控制器 -->
		<div class="handles">
			<handles v-ref:handles 
				:status="status">
			</handles>
		</div>
		
		<!-- 全屏覆盖的消息 -->
		<div class="msg" v-show="msg">
			<span>{{msg}}</span>
		</div>
	</div>
</template>

<script>
	import Shape from './shape.js'
	import { css, query } from '../lib/dom.js'
	import interval from '../lib/interval.js'
	import Hammer from '../lib/hammer.js'

	const initSpeed = 2;

	export default {
		data: function(){
			return {
				cellWidth: 20,
				shapeWidth: 3,
				width: 0,
				height: 0,
				startOffset: [0, 0],
				current: null,
				preview: null,
				score: 0,
				timer: null,
				speed: initSpeed,
				status: 'ready',
				msg: 'TOUCH START',
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

				this.width = Math.min(doc.clientWidth, 400) - 20;
				this.height = doc.clientHeight - 20;

				this.width -= 100;
				this.height -= 150;

				this.col = Math.floor(this.width/(this.cellWidth + 2));
				this.row = Math.floor(this.height/(this.cellWidth + 1));

				// 计算形状出现的起始位置
				this.startOffset = [
					Math.floor(this.col/2) - Math.floor(this.shapeWidth/2), 
					-this.shapeWidth
				];
			},

			// 显示表格
			render: function(){
				css('.game', {
					height: document.documentElement.clientHeight + 'px',
				});
				css('.main', {
					height: this.height + 'px',
					width: this.width + 'px',
				});
				css('.side', {
					height: this.height + 'px',
				});
			},

			// 创建形状
			add: function(){
				this.status = 'playing';
				this.current = this.preview || Shape.random();
				this.$refs.preview.reset();
				this.preview = Shape.random();
			},

			// 立即开始
			restart: function(){
				this.$refs.chessboard.reset();
				this.score = 0;
				this.status = 'playing';
				this.add();
			},

			// 
			toggleMsg: function(){
				var vm = this;

				switch(this.status){
					case 'ready':
						vm.status = 'playing';
						vm.add();
						break;
					case 'gameover':
						vm.restart();
						break;
					case 'suspend':
						vm.status = 'playing';
						break;
				};

				return this;
			}

		},

		watch: {
			status: function(status){
				this.msg = {
					suspend: 'SUSPEND',
					gameover: 'GAME OVER'
				}[status] || '';
			},
			score: function(score){
				// 分数增加100，速度就增加1
				if(score < 100){
					return;
				};
				// 增加速度
				this.speed = initSpeed + Math.floor(score/100);
				// 立即生效
				this.timer.time = 1000/this.speed;
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
			}, 1000/vm.speed);

			// shape停止后添加新的，并且重置速度
			chessboard.$on('stop', function(shape){
				vm.add();
				vm.timer.time = 1000/vm.speed;
			});
			// 计分
			chessboard.$on('score', function(times){
				vm.score += vm.col * times;
			});
			// gameover
			chessboard.$on('gameover', function(times){
				vm.status = 'gameover';
			});

			// 手柄
			handles.$on('move', function(d){
				chessboard.move(d);
				// 按一次向下按钮，就加速30%
				if(d == 'down'){
					vm.timer.time -= vm.timer.time*0.3;
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

			//
			new Hammer(query('.play')).on('tap', function(e){
				if(vm.status === 'suspend'){
					vm.status = 'playing';
				}else if(vm.status === 'playing'){
					vm.status = 'suspend';
				};
			});

			// toggle msg
			new Hammer(query('.msg')).on('tap', function(e){
				vm.toggleMsg();
			});

		}
	};
</script>