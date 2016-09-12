<style lang="stylus" scoped>
	h1{
		margin 20px auto 0 auto;
		font-size: 14px;
		padding 6px 0;
		text-align: center;
		//border: 1px solid #F60;
		border-radius: 3px;
		width: 65px;
		color: #F60;
	}
</style>

<template>
	<h1>{{score}}</h1>
</template>

<script>
	export default {
		props: ['score']
	}
</script>