<template>
	<div class="g-reset"> 
		<vcc-bread-crumb v-if="routes.length" :routes="routes" />
		<slot />
	</div>
</template>
<script>
import { defineComponent, onMounted, watch } from 'vue';
import BreadCrumb from './bread-crumb.vue';

export default defineComponent({
	name: "vcc-set-title",
	components: {
		'vcc-bread-crumb': BreadCrumb
	},
	props: {
		title: String,
		routes: {
			type: Array,
			default: () => ([])
		}
	},
	setup(props, ctx) {
		const resetTitle = () => {
			document.title = props.title || document.title;
		};

		onMounted(resetTitle);

		watch(() => props.title, resetTitle);
	}
});
</script>