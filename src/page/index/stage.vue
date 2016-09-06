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
	</div>
</template>

<script>
	import Shape from './shape.js'

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
					fn && fn(cell);
					cells.push(cell);
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

				this.width = Math.floor(cw/cellWidth);
				this.height = Math.floor(ch/cellWidth);
				this.start = [Math.floor(this.width/2), 0];
			},
			tick: function(){
				var activeUnit = this.activeUnit;
				activeUnit.down();
				console.info(activeUnit.prev)
				activeUnit.prev && this.findCells(activeUnit.prev, function(cell){
					cell.cls = '';
				});
				this.findCells(activeUnit, function(cell){
					cell.cls = 'active';
				});
			},
			createShape: function(type){
				var shape = Shape.create(type);
				shape.offset(this.start);
				this.activeUnit = shape;
			}
		},
		ready: function(){
			this.calSize();
			this.renderGrid();
			this.createShape('T');
			setInterval(this.tick, 1000);
		}
	};
</script>