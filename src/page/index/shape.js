
var shapes = {
	'L': [[0,0],[0,1],[0,2],[1,2]],
	'T': [[0,0],[1,0],[2,0],[1,1],[1,2]],
	'7': [[1,0],[2,0],[2,1],[2,2]],
	'1': [[1,0],[1,1],[1,2]]
};

function Shape(array){
	this._array = array || [];
	this._array.forEach(function(n,i){
		this[i] = n;
	}.bind(this));
}

Shape.prototype = {
	forEach: function(fn){
		this._array.forEach(fn);
		return this;
	},
	offset: function(offset){
		this._array.forEach(function(n){
			n[0] += offset[0];
			n[1] += offset[1];
		});
		return this;
	},
	down: function(){
		this.prev = this.toJson();
		this.offset([0, 1]);
		return this;
	},
	move: function(d){
		if(d === 'left'){
			this.prev = this.toJson();
			this.offset([-1, 0]);
		}else if(d === 'right'){
			this.prev = this.toJson();
			this.offset([1, 0]);
		}else{
			throw 'except "left" or "right"';
		};
		return this;
	},
	toJson: function(){
		return JSON.parse(JSON.stringify(this._array));
	},
	setStage: function(stage){

	}
};

Shape.create = function(type){
	var shape;
	//
	type = type.toUpperCase();
	shape = shapes[type];
	//
	if(shape){
		return new Shape(shape);
	}else{
		return new Shape('L');
	};
};

export default Shape;