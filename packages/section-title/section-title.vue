<template>
	<div 
		:style="style"
		class="vcc-section-title"
	>	
		<p v-if="typeof content === 'string' && content" class="vcc-section-title__text" v-html="content" />
		<slot v-if="slots.default" />
	</div>
</template>
<script lang="ts">
import { computed, defineComponent } from "vue";

export default defineComponent({
	name: 'vcc-section-title',
	props: {
		content: {
			type: [String, Number],
			default: ''
		},
		// 是否需要背景色
		background: {
			type: String,
			default: '#f9f9f9'
		}
	},
	setup(props, { slots }) {
		const style = computed(() => {
			return {
				background: props.background
			};
		});
		return {
			style,
			slots
		};
	}
});
</script>
<style lang="scss">
.vcc-section-title {
	display: flex;
	padding: 0 24px;
	font-size: 14px;
	font-weight: bold;
	line-height: 50px;
	color: #000;

	&::before {
		display: inline-block;
		width: 2px;
		height: 14px;
		margin: 18px 7px 0 0;
		background-color: #e6686b;
		content: '';
	}

	&__text {
		display: flex;
		margin: 0;
	}
}
</style>


