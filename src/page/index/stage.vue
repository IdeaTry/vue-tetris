<style lang="stylus">
	.stage{
		width auto;
		text-align center;
		
		h1{
			margin 0;
			height 100px;
			line-height 100px;
		}
		
		table{
			border-collapse collapse;
			background #EEE;
			margin 0 auto;
		}
		
		td{
			width 25px;
			height 25px;
			border 1px solid #FFF;
		}
	}
	
	td.red{
		background red;
	}
	td.orange{
		background orange;
	}
	td.green{
		background green;
	}
	td.blue{
		background blue;
	}
	td.active{
		background gray;
	}

	.control{
		height 100px;
		position relative;

		.line:first-child{
			margin-top 10px;
		}
		.line{
			height 30px;
			line-height 30px;
			text-align center;
			
			.btn{
				height 30px;
				width 30px;
				display inline-block;
				border 1px solid #CCC;
				border-radius 15px;
				background #DDD
			}

			.btn:active{
				background #393;
			}

			.btn.left{
				margin-right 40px;
			}
		}
	}
</style>

<template>
	<div class="stage">
		<h1>{{status}}</h1>
		<table>
			<tr v-for="row in rows">
				<td v-for="cell in row" :class="cell.cls">
				</td>
			</tr>
		</table>
		<div class="control">
			<div class="line">
				<div class="btn change"></div>
			</div>
			<div class="line">
				<div class="btn left"></div>
				<div class="btn right"></div>
			</div>
			<div class="line">
				<div class="btn down"></div>
			</div>
		</div>
	</div>
</template>

<script>
	import Shape from './shape.js'
	import Hammer from '../../lib/hammer.js'
	//import { on } from '../../lib/dom.js'

	export default {
		data: function(){
			return {
				cellWidth: 25,
				width: 10,
				height: 20,
				rows: [],
				activeUnit: null,
				start: [0, -3],
				status: 'stop'
			};
		},
		methods: {
			// 绘制表格
			renderGrid: function(){
				var rows = [], row;

				for(var i = 0; i < this.height; i++){
					row = [];
					for(var j = 0; j < this.width; j++){
						row.push({
							row: i,
							col: j,
							cls: ''
						});
					};
					rows.push(row);
				};
				this.rows = rows;
			},
			// 遍历所有格子
			eachCell: function(fn){
				this.rows.forEach(function(cells){
					cells.forEach(function(cell){
						fn(cell);
					});
				});
			},
			// 查找指定格子
			findCell: function(point){
				var col = point[0], row = point[1];
				return (this.rows[row] || [])[col] || null;
			},
			// 查找一组格子
			findCells: function(indexs, fn){
				var cells = [], cell, 
					findCell = this.findCell.bind(this);
				indexs.forEach(function(point){
					cell = findCell(point);
					if(cell){
						fn && fn(cell);
						cells.push(cell);
					};
				});
				return cells;
			},
			// 计算画布尺寸：格子的数量
			calSize: function(){
				var doc = document.documentElement,
					cw = doc.clientWidth ,
					ch = doc.clientHeight ,
					cellWidth = this.cellWidth + 3;

				ch -= 100; // 减去h1的高度
				ch -= 100; // 减去control的高度

				this.width = Math.floor(cw/cellWidth);
				this.height = Math.floor(ch/cellWidth);
				this.start = [Math.floor(this.width/2), -3];
			},
			// 刷新状态
			refreshActive: function(){
				this.activeUnit.prev && this.findCells(this.activeUnit.prev, function(cell){
					cell.cls = '';
				});
				this.findCells(this.activeUnit, function(cell){
					cell.cls = 'active';
				});
			},
			// 创建形状
			createShape: function(type){
				this.activeUnit = Shape.create(type).offset(this.start);
				this.refreshActive();
			},
			// 移动：左、右、下
			move: function(type){
				if(this.activeUnit){
					// testMove
					if(!this.testMove(this.activeUnit.clone().move(type).specific(this.activeUnit))){
						if(type === 'down'){
							if(this.isGameOver()){
								this.status = 'game over';
							};
							this.createShape('T');
						};
						return;
					};
					// move
					this.activeUnit.move(type);
					this.refreshActive();
				}
			},
			// 检查是否gameover
			isGameOver: function(){
				var failed = false;
				this.activeUnit && this.activeUnit.forEach(function(n){
					failed = failed || n[1] < 0;
				});
				return failed;
			},
			// 检查是否可移动
			testMove: function(shape){
				var reject = false, cell;
				
				// 检查每一个请求新占的格子
				shape.forEach(function(n){
					if(reject) return;
					// 检查是否超出边界或者被物体阻挡
					if(n[0] < 0 || n[0] >= this.width || n[1] >= this.height){
						reject = true;
					}else{
						cell = this.findCell(n);
						if(cell && cell.cls === 'active'){
							reject = true;
							console.info('阻挡');
						};
					};
				}.bind(this));
				// 如果未被阻挡则测试通过
				return !reject;
			}
		},
		ready: function(){

			// 计算尺寸然后绘制表格
			this.calSize();
			this.renderGrid();

			// 创建初始形状，然后开始游戏
			this.createShape('T');
			this.status = 'playing';
			
			// 形状不断下降
			setInterval(function(){
				if(this.status === 'playing'){
					this.move('down');
				};
			}.bind(this), 500);
			
			// 按钮事件
			new Hammer(this.$el).on('swipeleft swiperight', function(e){
				this.move(e.type.replace('swipe', ''));
			}.bind(this));

			new Hammer(document.querySelector('.btn.left')).on('tap', function(){
				this.move('left');
			}.bind(this));

			new Hammer(document.querySelector('.btn.right')).on('tap', function(){
				this.move('right');
			}.bind(this));

			new Hammer(document.querySelector('.btn.down')).on('tap', function(){
				this.move('down');
			}.bind(this));
		}
	};
</script>