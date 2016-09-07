
import Rotator from './shape-rotator.js'

const shapes = {
	'L': [[0,0],[0,1],[0,2],[1,2]],
	'T': [[0,0],[1,0],[2,0],[1,1],[1,2]],
	'7': [[1,0],[2,0],[2,1],[2,2]],
	'1': [[1,0],[1,1],[1,2]]
};

function Shape(array){
	if(array){
		this.set(array);
	};
	this.rotator = new Rotator({
		width: 3
	});
}

Shape.prototype = {
	set: function(array){
		if(!array || !array.length) throw 'need array';
		this._array = JSON.parse(JSON.stringify(array));
		this._array.forEach(function(n,i){
			this[i] = n;
		}.bind(this));
	},
	forEach: function(fn){
		this._array.forEach(fn);
		return this;
	},
	offset: function(offset){
		if(arguments.length === 0){
			
		};

		this._array.forEach(function(n){
			n[0] += offset[0];
			n[1] += offset[1];
		});
		return this;
	},
	move: function(d){
		if(d === 'left'){
			this.prev = this.toJson();
			this.offset([-1, 0]);
		}else if(d === 'right'){
			this.prev = this.toJson();
			this.offset([1, 0]);
		}else if(d === 'down'){
			this.prev = this.toJson();
			this.offset([0, 1]);
		}else{
			throw 'except "left" or "right"';
		};
		return this;
	},
	roate: function(){console.info(this.toJson())
		this.rotator.left(this.toJson());
	},
	clone: function(){
		return new Shape(this.toJson());
	},
	specific: function(shape){
		var map = this.toMap();
		var specific = [];
		shape.forEach(function(n){
			delete map[n.toString()];
		});
		Object.keys(map).forEach(function(n){
			specific.push(map[n]);
		});
		return specific;
	},
	toJson: function(){
		return JSON.parse(JSON.stringify(this._array));
	},
	toMap: function(){
		var map = {};
		this.forEach(function(n){
			map[n.toString()] = n;
		});
		return map;
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
		throw 'wrong shape "' + type + '"';
	};
};

export default Shape;