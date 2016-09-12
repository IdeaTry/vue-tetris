var Interval = function(fn, time){

    this.fn = fn;
    this.time = time || 1000;
    this.tick();
    this.suspend = false;

    return this;
}

Interval.prototype = {
    tick: function(){
        this._timer = setTimeout(function(){
            if(!this.suspend){
                this.fn();
            };
            this.tick();
        }.bind(this), this.time);
    },
    stop: function(){
        clearTimeout(this._timer);
    }
};

export default function(fn, time){
    return new Interval(fn, time);   
};