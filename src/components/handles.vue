<style lang="stylus" scoped>
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
</template>

<script>
	import Hammer from '../lib/hammer.js'

	export default {
		props: ['status'],
		methods: {
			move: function(d){
				this.$emit('move', d);
			},
			roate: function(){
				this.$emit('roate');
			},
			suspend: function(){
				this.$emit('suspend');
			},
			resume: function(){
				this.$emit('resume');
			},
		},
		ready: function(){
			var vm = this;

			// 手势控制
			new Hammer(document.querySelector('body')).on('swipeleft swiperight swipedown swipeup', function(e){
				if(vm.status !== 'playing') return;

				if(e.type === 'swipeup'){
					vm.roate();
				}else{
					vm.move(e.type.replace('swipe', ''));
				};
			}).get('swipe').set({ direction: Hammer.DIRECTION_ALL });

			// 按钮控制
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

			// 键盘控制
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

			// @page
			document.addEventListener('touchstart', function(e){
				e.returnValue = false;
			});
		}
	}
</script>