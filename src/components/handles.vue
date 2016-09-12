<style lang="stylus" scoped>
	
	.control{
		padding 5px 0 0 0;
		margin 0 1em;
		
		.control-content{
			width: 200px;
			height: 120px;
			background: #FFF;
			margin: 0 auto;
		}

		table{
			border-collapse: collapse;
			width: 100%;

			td{
				border: 1px solid #FFF;
				vertical-align: middle;
				width: 33.33%;
				text-align: center;
				color: #FFF;
			}

			td.roate,
			td.down{
				height: 50px;
			}

			td.touch-style{
				background: #FFF;
			}
		}
			
	}
</style>

<template>
	<div class="control">
		<table>
			<tr>
				<td class="btn left" rowspan="2">←</td>
				<td class="btn roate"></td>
				<td class="btn right" rowspan="2">→</td>
			</tr>
			<tr>
				<td class="btn down">↓</td>
			</tr>
		</table>
	</div>
</template>

<script>
	import Hammer from '../lib/hammer.js'
	import { addClass, removeClass, on } from '../lib/dom.js'

	function touchStyle(tag){
		addClass(tag, 'touch-style');
		setTimeout(function(){
			removeClass(this, 'touch-style');
		}.bind(tag), 100);
	}

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
			//
			on('td.btn', 'touchstart', function(e){
				touchStyle(e.target);
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

			// 防止微信的页面上下拖动效果
			document.addEventListener('touchstart', function(e){
				e.returnValue = false;
			});
		}
	}
</script>