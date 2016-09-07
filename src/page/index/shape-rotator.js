var Rotator = function(opt){
	opt = opt || {};
	opt.width = opt.width || 3;
};

Rotator.prototype = {
	left: function(shape){
		var matrix = shapeToMatrix(shape);
		console.info(matrix);
	},
	right: function(shape){

	}
};

function shapeToMatrix(shape, width){
	var matrix = createMatrix(width);
	shape.forEach(function(n){
		var i = n[0], j = n[1];
		if(matrix[i] && matrix[i][j]){
			matrix[i][j] = 'yes';
		};
	});
};

function createMatrix(width){
	var matrix = [], row;
	for(var i = 0; i < width; i++){
		row = [];
		for(var j = 0; j < width; j++){
			row.push('no');
		};
		matrix.push(row);
	};
	return matrix;
};

export default Rotator;