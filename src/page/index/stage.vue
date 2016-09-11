<style lang="stylus">
	.stage{
		width auto;
		text-align center;
		padding 10px;
		
		h1{
			margin 0;
			font-size: 14px;
			padding 1em;
		}
		
		table.main,
		table.preview{
			border-collapse collapse;
			background #EEE;
			margin 0 auto;
		
			td{
				width 20px;
				height 20px;
				border 1px solid #FFF;
				font-size 9px
				text-align center
				color #CCC
				padding 0 0 0 1px
			}
		}
		
		table.main{
			float left;
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

	.side{
		width 100px;
		height 100%;
		float right;
		position relative;
	}

	.control{
		height 120px;
		position absolute;
		bottom 10px;

		.line:first-child{
			margin-top 10px;
		}
		.line{
			height 40px;
			line-height 40px;
			text-align center;
			
			.btn{
				height 40px;
				width 40px;
				display inline-block;
				border 1px solid #CCC;
				border-radius 15px;
				background #DDD
			}

			.btn:active{
				background #393;
			}

			.btn.left{
				margin-right 10px;
			}
		}
	}
</style>

<template>
	<div class="stage">
		<table class="main">
			<tr v-for="row in rows">
				<td v-for="cell in row" :class="cell.cls"></td>
			</tr>
		</table>
		<div class="side">
			<h1>{{status}}</h1>
			<div>
				<table class="preview">
					<tr v-for="row in prevRows">
						<td v-for="cell in row" :class="cell.cls"></td>
					</tr>
				</table>
			</div>
			<div class="control">
				<div class="line">
					<div class="btn roate"></div>
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
	</div>
</template>

<script>
	import Shape from './shape.js'
	import Hammer from '../../lib/hammer.js'
	import { css } from '../../lib/dom.js'

	export default {
		data: function(){
			return {
				cellWidth: 20,
				width: 10,
				height: 20,
				rows: [],
				current: null,
				start: [0, 0],
				status: 'stop',
				shapeWidth: 3,
				prevRows: [],
				prev: null
			};
		},
		methods: {

			// 预览表格
			renderPrevGrid: function(){
				var rows = [], row;

				for(var i = 0; i < this.shapeWidth; i++){
					row = [];
					for(var j = 0; j < this.shapeWidth; j++){
						row.push({ row: i, col: j, cls: '' });
					};
					rows.push(row);
				};

				this.prevRows = rows;
			},

			// 绘制表格
			renderGrid: function(){
				var rows = [], row;

				for(var i = 0; i < this.height; i++){
					row = [];
					for(var j = 0; j < this.width; j++){
						row.push({ row: i, col: j, cls: '' });
					};
					rows.push(row);
				};

				this.rows = rows;
			},

			// 遍历所有格子
			eachCell: function(rows, fn){
				rows.forEach(function(cells){
					cells.forEach(function(cell){
						fn(cell);
					});
				});
			},

			// 查找指定格子
			findCell: function(rows, point){
				var col = point[0], row = point[1];
				return (rows[row] || [])[col] || null;
			},

			// 查找一组格子
			findCells: function(rows, indexs, fn){
				var cells = [], cell, findCell = this.findCell.bind(this);

				indexs.forEach(function(point){
					cell = findCell(rows, point);
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
					cw = doc.clientWidth - 20,
					ch = doc.clientHeight - 20,
					cellWidth = this.cellWidth ;

				cw -= 100; // 减去side的宽度

				this.width = Math.floor(cw/(cellWidth + 2));
				this.height = Math.floor(ch/(cellWidth + 1));
				this.start = [Math.floor(this.width/2), -3];

				document.querySelector('.stage').style.height = (ch - 20) + 'px';
			},

			// 刷新预览
			refreshPrev: function(){
				this.eachCell(this.prevRows, function(cell){
					cell.cls = '';
				});
				this.findCells(this.prevRows, this.prev, function(cell){
					cell.cls = 'active';
					console.info(cell)
				});
			},

			// 刷新显示：清空轨迹，并在新的位置显示
			refreshActive: function(){
				this.current.prev && this.findCells(this.rows, this.current.prev, function(cell){
					cell.cls = '';
				});
				this.findCells(this.rows, this.current, function(cell){
					cell.cls = 'active';
				});
			},

			// 创建形状
			createShape: function(){
				this.current = this.prev || Shape.random();
				this.current.offset(this.start);
				this.refreshActive();
				//
				this.prev = Shape.random();
				this.refreshPrev();
			},

			// 移动：左、右、下
			move: function(type){
				if(!this.current) return;
				// test move
				if(!this.testMove(this.current.clone().move(type).specific(this.current))){
					if(type === 'down'){
						// test gameover
						if(this.isGameOver()){
							this.status = 'game over';
							return;
						};
						//
						this.testDissolve();
						//
						this.createShape();
					};
					return;
				};
				// move
				this.current.move(type);
				this.refreshActive();
			},

			moveBottom: function(){
				while(this.testMove(this.current.clone().move('down').specific(this.current))){
					this.current.move('down');
					this.refreshActive();
				};
			},

			// 旋转（向左）
			roate: function(){
				if(!this.current) return;
				// test roate
				if(!this.testMove(this.current.clone().roate().specific(this.current))){
					return;
				};
				this.current.roate(); 
				this.refreshActive();
			},

			// 检查是否gameover
			isGameOver: function(){
				var failed = false;
				this.current && this.current.forEach(function(n){
					failed = failed || n[1] < 0;
				});
				return failed;
			},

			// 检查移动或旋转是否允许
			testMove: function(shape){
				var reject = false, cell, rows = this.rows;
				
				// 检查每一个请求新占的格子
				shape.forEach(function(n){
					if(reject) return;
					// 检查是否超出边界或者被物体阻挡
					if(n[0] < 0 || n[0] >= this.width || n[1] >= this.height){
						reject = true;
					}else{
						cell = this.findCell(rows, n);
						if(cell && cell.cls === 'active'){
							reject = true;
							console.info('阻挡');
						};
					};
				}.bind(this));
				// 如果未被阻挡则测试通过
				return !reject;
			},

			dissolve: function(y){

			},

			testDissolve: function(){

			},

			suspend: function(){
				if(this.status !== 'playing') return;
				this.status = 'suspend';
			},

			resume: function(){
				if(this.status !== 'suspend') return;
				this.status = 'playing';
			}
			
		},

		ready: function(){
			var vm = this;

			// 绘制预览表格
			vm.renderPrevGrid();

			// 计算尺寸然后绘制表格
			vm.calSize();
			vm.renderGrid();

			// 创建初始形状，然后开始游戏
			vm.createShape();
			vm.status = 'playing';
			
			// 形状不断下降
			setInterval(function(){
				if(vm.status === 'playing'){
					vm.move('down');
				};
			}, 500);
			
			// 按钮事件
			new Hammer(vm.$el).on('swipeleft swiperight', function(e){
				if(vm.status !== 'playing') return;
				vm.move(e.type.replace('swipe', ''));
			});

			new Hammer(document.querySelector('.btn.left')).on('tap', function(){
				if(vm.status !== 'playing') return;
				vm.move('left');
			});

			new Hammer(document.querySelector('.btn.right')).on('tap', function(){
				if(vm.status !== 'playing') return;
				vm.move('right');
			});

			new Hammer(document.querySelector('.btn.down')).on('tap', function(){
				if(vm.status !== 'playing') return;
				vm.move('down');
			});

			new Hammer(document.querySelector('.btn.roate')).on('tap', function(){
				if(vm.status !== 'playing') return;
				vm.roate();
			});

			document.addEventListener('keydown', function(e){
				switch(e.key){
					case 'ArrowLeft':
						return vm.status === 'playing' && vm.move('left');
					case 'ArrowRight':
						return vm.status === 'playing' && vm.move('right');
					case 'ArrowDown':
						return vm.status === 'playing' && vm.move('down');
					case 'ArrowUp':
						return vm.status === 'playing' && vm.roate();
					case ' ':
						if(vm.status === 'suspend'){
							vm.resume();
						}else if(vm.status === 'playing'){
							vm.suspend();
						};
						return;
				}
			});

			document.addEventListener('touchstart', function(e){
				e.returnValue = false;
			});
		}
	};
</script>