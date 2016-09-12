<style lang="stylus" scoped>
	$td-width = 20px;
	
	.chessboard{
		width auto;
		text-align center;
		padding 10px;
		
		table{
			border-collapse collapse;
			background #EEE;
			margin 0 auto;
		
			td{
				width $td-width;
				height $td-width;
				border 1px solid #FFF;
				font-size 9px
				text-align center
				color #CCC
				padding 0 0 0 1px
			}
		
			td.active{
				background gray;
			}
		}
	}
</style>

<template>
	<div class="chessboard">
		<table>
			<tr v-for="row in rows">
				<td v-for="cell in row" :class="cell.val == 1 ? 'active' : ''"></td>
			</tr>
		</table>
	</div>
</template>

<script>
	import Chessboard from './chessboard.js'

	export default {
		props: ['col', 'row', 'current', 'start'],
		data: function(){
			return {
				rows: [],
				c: new Chessboard()
			};
		},
		methods: {
			// 重置
			reset: function(){
				if(!this.col || !this.row) return;
				//
				this.c.col = this.col;
				this.c.row = this.row;
				//
				this.c.reset();
			},
			// 旋转图形
			roate: function(){
				this.c.roate();
			},
			// 移动图形
			move: function(d){
				this.c.move(d);
			},
			// 重力
			drop: function(){
				this.c.move('down');
			},

		},

		// 把主界面控制器的命令传递给棋盘的控制器
		watch: {
			current: function(shape){
				if(shape){
					this.c.add(shape);
				};
			}
		},

		// 初始化
		ready: function(){
			var c = this.c, vm = this;

			c.start = vm.start;

			c.on('reset', function(rows){
				vm.rows = rows;
			});

			c.on('stop', function(shape){
				vm.$emit('stop', shape);
			});

			c.on('score', function(times){
				vm.$emit('score', times);
			});

			c.on('gameover', function(){
				vm.$emit('gameover');
			});

			this.reset();
		}
	};
</script>