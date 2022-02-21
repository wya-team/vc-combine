<template>
	<vcc-map-location 
		v-model="lnglat" 
		@change="handleChange"
	/>
</template>

<script setup>
import { ref, watch } from 'vue';
import Map from '../index.ts';

const VccMapLocation = Map.Location;
const lnglat = ref([120.157835, 30.287163]);
const handleChange = (v, r) => {
	console.log('changed', r);
};

watch(() => lnglat.value, (v) => {
	console.log(v);
});
</script>
