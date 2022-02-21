<template>
	<div style="position: relative;">
		<vc-input-search 
			v-model="search"
			placeholder="请输入关键词，按回车搜索"
			:style="`
				position: absolute;
				top: 5px;
				left: 12px;
				width: 300px;
				background-color: #fff;
				z-index: 999;
			`"
			@keyup="handleMapSearch"
		/>
		<vcc-map 
			:id="mapId" 
			ui 
			style="height: 300px;" 
			:options="options"
			@ready="handleMapReady"
		/>
		<input :id="searchInputId" style="display: none;">
		<div 
			:id="searchResultsId" 
			:style="`
				overflow: auto;
				position: absolute;
				top: 50px;
				left: 12px;
				height: 200px;
				max-width: 300px;
				background-color: #fff;
				z-index: 999;
			`"
		/>
	</div>
</template>

<script setup>
import { ref, reactive, defineProps } from 'vue';
import { Input } from '@wya/vc';
import { Utils } from '@wya/utils';
import VccMap from '../index.ts';

const props = defineProps({
	longitude: String,
	latitude: String
});
const VcInputSearch = Input.Search;

const options = ref({
	zoom: 16,
	resizeEnable: true,
	scrollWhell: false,
});

const search = ref('');
const mapId = ref(Utils.getUid('map'));
const searchInputId = ref(Utils.getUid('search-input'));
const searchResultsId = ref(Utils.getUid('search-results'));
const mapAssist = reactive({
	instance: null,
	marker: null,
	geocoder: null,
	infoWindow: null,
	poiPicker: null
});

const setCurrent = (v) => {
	
};

// 通过经纬度调用高德逆地理编码（坐标 -> 地址）api  AMap.Geocoder
const regeoCode = (lnglat) => {
	return new Promise((resolve) => {
		mapAssist.geocoder.getAddress(lnglat, (status, result) => {
			if (status === 'complete') {
				resolve(result);
			}
		});
	});
};

const handleMapClick = async (e) => {
	const lnglat = [e.lnglat.getLng(), e.lnglat.getLat()];

	mapAssist.marker.setPosition(lnglat);

	if (mapAssist.infoWindow.getIsOpen()) {
		mapAssist.infoWindow.setPosition(position);
	} else {
		mapAssist.infoWindow.open(mapAssist.instance, position);
	}

	const result = await regeoCode(lnglat);
	mapAssist.infoWindow.setContent(
		`<div>${result.regeocode.formattedAddress}</div>`
	);

	setCurrent(result);
};


const handleMapReady = (e) => {
	mapAssist.instance = e.target;
	mapAssist.instance.on('click', handleMapClick);

	if (!mapAssist.marker) {
		mapAssist.marker = new AMap.Marker({
			icon: "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
		});
		mapAssist.instance.add(mapAssist.marker);
	}

	if (!mapAssist.geocoder) {
		const done = () => {
			mapAssist.geocoder = new AMap.Geocoder();
		};
		if (!AMap.Geocoder) {
			AMap.plugin('AMap.Geocoder', done);
		} else {
			done();
		}
	}

	if (!mapAssist.infoWindow) {
		mapAssist.infoWindow = new AMap.InfoWindow({
			autoMove: true,
			offset: new AMap.Pixel(0, -32)
		});
	}

	AMapUI.loadUI(['misc/PoiPicker'], (PoiPicker) => {
		const picker = new PoiPicker({
			input: searchInputId.value,
			placeSearchOptions: {
				map: e.target,
				city: 'auto',
				pageSize: 10
			},
			searchResultsContainer: searchResultsId.value,
			suggestContainer: searchResultsId.value
		});
		picker.on('poiPicked', async (poiResult) => {
			picker.hideSearchResults();

			if (poiResult.source !== 'search') {
				picker.searchByKeyword(poiResult.item.name);
			}
			const { lng, lat } = poiResult.item.location;
			const result = await regeoCode([lng, lat]);
			setCurrent(result);
		});
		mapAssist.poiPicker = picker;
	});

	 // 如果存在经纬度，说明已经设置过地址，直接点标记展示即可
	if (props.longitude && props.latitude) {
		const lnglat = {
			getLng: () => longitude,
			getLat: () => latitude
		};

		handleMapClick({ lnglat });
		mapAssist.instance.setCenter([longitude, latitude]);
	}
};

const handleMapSearch = (e) => {
	if (e.keyCode == 13 || e.keyCode == 108) {
		mapAssist.poiPicker.searchByKeyword(search.value);
	}
};


</script>
