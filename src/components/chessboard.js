import Shape from './shape.js'
import EventEmitter from 'event-emitter';

// 遍历所有格子
function eachCell(rows, fn){
	rows.forEach(function(cells){
		cells.forEach(function(cell){
			fn(cell);
		});
	});
}

// 查找指定格子
function findCell(rows, point){
	var col = point[0], row = point[1];
	return (rows[row] || [])[col] || null;
}

// 查找一组格子
function findCells(rows, indexs, fn){
	var cells = [], cell;

	indexs.forEach(function(point){
		cell = findCell(rows, point);
		if(cell){
			fn && fn(cell);
			cells.push(cell);
		};
	});

	return cells;
}


var Chessboard = function(){};

Chessboard.prototype = EventEmitter({

	// 绘制表格
	reset: function(){
		var rows = [], row, shapeWidth = 3;

		if(!this.row || !this.col) return this;

		// 绘制空表格
		for(var i = 0; i < this.row; i++){
			row = [];
			for(var j = 0; j < this.col; j++){
				row.push({ row: i, col: j, val: 0, cls: '' });
			};
			rows.push(row);
		};

		this.emit('reset', rows);

		this.rows = rows;
	},

	// 创建一块新的形状，并且刷新显示
	add: function(shape){
		this.track = null;
		this.current = shape;
		if(this.start){
			this.current.offset(this.start);
		};
		this.refresh();
	},

	// 刷新显示：清空轨迹，并在新的位置显示
	refresh: function(){
		this.track && findCells(this.rows, this.track, function(cell){
			cell.val = 0;
		});
		
		findCells(this.rows, this.current, function(cell){
			cell.val = 1;
		});

		this.emit('refresh', this.rows);
	},

	// 移动：左、右、下
	move: function(type){
		if(!this.current) return this;
		// test move
		if(!this.testMove(this.current.clone().move(type).specific(this.current))){
			if(type === 'down'){
				// test gameover
				if(this.isGameOver()){
					this.emit('gameover');
					return this;
				};
				// 检查是否有可以消除的行
				this.testDissolve();
				//
				this.emit('stop', this.current.toJson());
			};
		}else{
			//
			this.track = this.current.toJson();
			// move
			this.current.move(type);
			this.refresh();
		};

		return this;
	},

	// 旋转（向左）
	roate: function(){
		if(!this.current) return this;
		// test roate
		if(!this.testMove(this.current.clone().roate().specific(this.current))){
			return this;
		};
		//
		this.track = this.current.toJson();
		//
		this.current.roate(); 
		this.refresh();
		return this;
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
			if(n[0] < 0 || n[0] >= this.col || n[1] >= this.row){
				reject = true;
			}else{
				cell = findCell(rows, n);
				if(cell && cell.val === 1){
					reject = true;
				};
			};
		}.bind(this));

		// 如果未被阻挡则测试通过
		return !reject;
	},

	// 消除
	dissolve: function(rowIndex){
		var rows = this.rows, prevRow;
		
		rows[0].forEach(function(cell){
			cell.val = 0;
		});

		while(rowIndex > 0){
			prevRow = rows[rowIndex - 1];
			rows[rowIndex].forEach(function(cell, colIndex){
				cell.val = prevRow[colIndex].val;
			});
			rowIndex--;
		};

		this.emit('dissolve', rowIndex);
		this.emit('refresh');

		return this;
	},

	// 尝试消除
	testDissolve: function(scoreTimes){
		var dissolveRowIndex = null;
		
		scoreTimes = scoreTimes || 1;

		this.rows.forEach(function(row, y){
			var hasEmpty = false;
			
			if(dissolveRowIndex !== null) return;

			row.forEach(function(cell){
				hasEmpty = hasEmpty || cell.val === 0;
			});

			if(!hasEmpty){
				dissolveRowIndex = y;
			};
		});

		if(dissolveRowIndex !== null){
			this.dissolve(dissolveRowIndex);
			this.emit('score', scoreTimes);
			this.testDissolve(scoreTimes+1);
		};

		return this;
	},
	
});

export default Chessboard;