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
			}

			.btn:active{
				background #369;
			}

			.btn.left{
				margin-right 30px;
			}
		}
	}
</style>

<template>
	<div class="stage">
		<h1>coming soon...</h1>
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
				start: [0,0]
			};
		},
		methods: {
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
			update: function(){

			},
			cellStatus: function(){
				return []; //return Math.random() > 0.5 ? ['active'] : [];
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
				this.start = [Math.floor(this.width/2), 0];
			},
			refreshActive: function(){
				this.activeUnit.prev && this.findCells(this.activeUnit.prev, function(cell){
					cell.cls = '';
				});
				this.findCells(this.activeUnit, function(cell){
					cell.cls = 'active';
				});
			},
			createShape: function(type){
				this.activeUnit = Shape.create(type).offset(this.start);
				this.refreshActive();
			},
			move: function(type){
				if(this.activeUnit){
					this.activeUnit.move(type);
					this.refreshActive();
				}
			}
		},
		ready: function(){
			this.calSize();
			this.renderGrid();
			this.createShape('T');

			//
			setInterval(function(){
				this.activeUnit.down();
				this.refreshActive();
			}.bind(this), 1000);
			
			//
			new Hammer(this.$el).on('swipeleft swiperight', function(e){
				this.move(e.type.replace('swipe', ''));
			}.bind(this));

			new Hammer(document.querySelector('.btn.left')).on('tap', function(){
				this.move('left');
			}.bind(this));

			new Hammer(document.querySelector('.btn.right')).on('tap', function(){
				this.move('right');
			}.bind(this));
		}
	};
</script>