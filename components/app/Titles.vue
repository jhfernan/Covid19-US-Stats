<template>
	<v-container>
		<v-toolbar dense flat>
			<v-spacer />
			<v-toolbar-title  :class="'display-' + size" v-text="title" />
			<v-spacer />
		</v-toolbar>
		<!-- <h1 class="text-center mt-3" :class="'display-' + size">{{ title }}</h1> -->
		<div class="title-divider"></div>
	</v-container>
</template>

<script>
export default {
	props: {
		title: {
			type: String,
			default: 'The title of our header'
		},
		size: {
			type: Number,
			default: 2
		}
	},
}
</script>

<style scoped>
.title-divider {
	display: block;
	width: 7rem;
	height: 0.3rem;
	background-color: blue;
	margin: 1rem auto;
}
</style>
