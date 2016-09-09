import Rotator from './shape-rotator.js'

// 预置的一些形状
const shapes = {
	'L': [[0,0],[0,1],[0,2],[1,2]],
	'T': [[0,0],[1,0],[2,0],[1,1]],
	'7': [[1,0],[2,0],[2,1],[2,2]],
	'1': [[1,0],[1,1],[1,2]],
	//'+': [[0,1],[1,0],[1,1],[2,1],[1,2]],
	'田': [[0,0],[0,1],[1,0],[1,1]],
	
};

// 所有预置的形状的key
const shapeKeys = Object.keys(shapes); 

// 形状对象，包含若干个格子，可以移动或者旋转，可以复制
function Shape(array){
	if(array){
		this.set(array);
	};
	this.rotator = new Rotator({
		width: 3
	});
	this.x = 0;
	this.y = 0;
}

Shape.prototype = {

	// 用一个二维数组来设定形状的所有的格子
	set: function(array){
		if(!array) throw 'need array';
		this._array = JSON.parse(JSON.stringify(array));
		this._array.forEach(function(n,i){
			this[i] = n;
		}.bind(this));

		return this;
	},

	// 遍历格子
	forEach: function(fn){
		this._array.forEach(fn);

		return this;
	},

	// 对形状（的所有格子）进行位移
	offset: function(offset){
		this.x += offset[0];
		this.y += offset[1];
		//
		this._array.forEach(function(n){
			n[0] += offset[0];
			n[1] += offset[1];
		});

		return this;
	},

	// 向左、右，或者向下移动
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

	// 旋转（向左）
	roate: function(){
		var clone = this.clone(), 
			x = this.x, 
			y = this.y;
		//
		clone.offset([-x, -y]);
		clone.set(this.rotator.left(clone.toJson()));
		clone.offset([ x,  y]);
		//
		this.prev = this.toJson();
		this.set(clone.toJson());

		return this;
	},

	// 克隆一个形状，可用于在移动和旋转之前的边缘和阻碍的检测
	clone: function(){
		var clone = new Shape(this.toJson());
		clone.x = this.x;
		clone.y = this.y;

		return clone;
	},

	// 跟另外一个形状进行比较，并返回比较对象所没有的点，用于清除轨迹
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

	// 转成纯数组格式的数据，便于计算
	toJson: function(){
		return JSON.parse(JSON.stringify(this._array));
	},

	// 转成键值对，便于计算
	toMap: function(){
		var map = {};
		this.forEach(function(n){
			map[n.toString()] = n;
		});

		return map;
	}
};

// 创建一个指定的形状
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

// 创建一个随机的形状
Shape.random = function(){
	var type = shapeKeys[parseInt(shapeKeys.length*Math.random(),10)];
	return Shape.create(type);
};

export default Shape;