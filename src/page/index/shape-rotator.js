// 对二维数组的形状进行旋转的工具类
var Rotator = function(opt){
	opt = opt || {};
	this.width = opt.width || 3;
};

Rotator.prototype = {

	// 对一个形状的二维数组进行向左旋转
	left: function(shape){
		var matrix = this.shapeToMatrix(shape, this.width);
		var rows = [], row, w = this.width;

		for(var j = 0; j < w; j++){
			row = [];
			for(var i = w - 1; i >= 0; i--){
				row.push(matrix[i][j]);
			};
			rows.push(row);
		};
		
		return this.matrixToShape(rows);
	},

	// 把图形转成矩阵
	shapeToMatrix: function(shape){
		var matrix = this.createMatrix();
		shape.forEach(function(n){
			var x = n[0], y = n[1];
			if(matrix[x] && matrix[x][y]){
				matrix[x][y] = 'yes';
			};
		});
		return matrix;
	},

	// 把矩阵转成图形
	matrixToShape: function(matrix){
		var shape = [];
		matrix.forEach(function(col, x){
			col.forEach(function(cell, y){
				if(cell === 'yes'){
					shape.push([x, y]);
				};
			});
		});
		return shape;
	},

	// 创建一个空的矩阵
	createMatrix: function(){
		var matrix = [], row;
		for(var i = 0; i < this.width; i++){
			row = [];
			for(var j = 0; j < this.width; j++){
				row.push('no');
			};
			matrix.push(row);
		};
		return matrix;
	}
};

export default Rotator;