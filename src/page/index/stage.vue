<style lang="stylus">
	.stage{
		width auto;
		text-align center;
		margin-top 20px;
		
		table{
			border-collapse collapse;
			background #EEE;
			margin 0 auto;
		}
		
		td{
			width 25px;
			height 25px;
			border 1px solid #FFF;
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
		background blue;
	}
</style>

<template>
	<div class="stage" @click="renderGrid()">
		<h1>coming soon...</h1>
		<table>
			<tr v-for="row in rows">
				<td v-for="col in cols" :class="cellStatus(col.index, row.index).join(' ')"></td>
			</tr>
		</table>
	</div>
</template>

<script>
	export default {
		data: function(){
			return {
				width: 10,
				height: 20,
				rows: [],
				cols: [],
				cells: [],
				units: []
			};
		},
		methods: {
			renderGrid: function(){
				var cols = [], rows = [], i;

				for(i = 0; i < this.width; i++){
					cols.push({ index: i });
				};

				for(i = 0; i < this.height; i++){
					rows.push({ index: i });
				};

				this.rows = rows;
				this.cols = cols;
			},
			update: function(){

			},
			cellStatus: function(){
				return Math.random() > 0.5 ? ['active'] : [];
			}
		},
		ready: function(){
			this.renderGrid();
		}
	};
</script>