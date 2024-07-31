<template>
	<vcc-map-location 
		v-model="lnglat" 
		@change="handleChange"
	/>
</template>

<script setup>
import { ref, watch } from 'vue';
import Map from '../index.ts';

// Map.Manager.inject({
// 	mapScript: '//webapi.amap.com/maps?v=2.0&key=yourkey',
// 	mapUIScript: '//webapi.amap.com/ui/1.1/main.js?v=1.1.11'
// });

// window._AMapSecurityConfig = {
// 	securityJsCode: "yoursecret",
// };

const VccMapLocation = Map.Location;
const lnglat = ref([120.157835, 30.287163]);
const handleChange = (v, r) => {
	console.log('changed', r);
};

watch(() => lnglat.value, (v) => {
	console.log(v);
});
</script>
