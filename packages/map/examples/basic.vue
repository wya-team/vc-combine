<template>
	<vcc-map 
		id="map" 
		ui 
		style=" width: 500px; height: 500px;" 
		:options="options"
	/>
</template>

<script>
import { defineComponent } from 'vue';
import Map from '../index.ts';

export default defineComponent({
	components: {
		'vcc-map': Map
	},
	setup() {
		return {
			options: {
				zoom: 16,
				resizeEnable: true,
				scrollWhell: false,
			}
		};
	}
});
</script>
