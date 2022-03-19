<template>
	<div style="position: relative;">
		<vc-input-search 
			v-if="searchable"
			v-model="currentSearch"
			placeholder="请输入关键词，按回车搜索"
			:style="[
				`
					position: absolute;
					top: 5px;
					left: 5px;
					width: 240px;
					background-color: #fff;
					z-index: 999;
				`,
				searchInputStyle
			]"
			@keyup="handleMapSearch"
			@enter="() => handleMapSearch({ keyCode: 13 })"
		/>
		<vcc-map 
			:id="mapId" 
			ui 
			:style="['height: 300px;', mapStyle]" 
			:options="mapOptions"
			@ready="handleMapReady"
		/>
		<input :id="searchInputId" style="display: none;">
		<div 
			:id="searchResultsId" 
			:style="[
				`
					overflow: auto;
					position: absolute;
					top: 40px;
					left: 5px;
					height: 220px;
					max-width: 240px;
					background-color: #fff;
					z-index: 999;
				`,
				searchResultsStyle
			]"
		/>
	</div>
</template>

<script>
import { watch, ref, reactive, defineComponent, inject } from 'vue';
import { Utils } from '@wya/utils';
import { Input } from '@wya/vc';
import Map from ".";

export default defineComponent({
	name: 'vcc-map-location',
	components: {
		'vcc-map': Map,
		'vc-input-search': Input.Search
	},
	props: {
		modelValue: {
			type: Array,
			default: () => ([])
		},
		searchable: {
			type: Boolean,
			default: true
		},
		mapId: {
			type: String,
			default: () => Utils.getUid('map')
		},
		mapOptions: {
			type: Object,
			default: () => ({
				zoom: 16,
				resizeEnable: true,
				scrollWhell: false,
			})
		},
		searchInputId: {
			type: String,
			default: () => Utils.getUid('search-input')
		},
		searchResultsId: {
			type: String,
			default: () => Utils.getUid('search-results')
		},
		searchInputStyle: [String, Object],
		searchResultsStyle: [String, Object],
		mapStyle: [String, Object]
	},

	emits: ['update:modelValue', 'change'],

	setup(props, { emit }) {
		const formItem = inject('form-item', {});

		const currentSearch = ref('');
		const currentValue = ref([]);
		const mapAssist = reactive({
			instance: null,
			marker: null,
			geocoder: null,
			infoWindow: null,
			poiPicker: null
		});

		const sync = (result, lnglat) => {
			currentValue.value = lnglat;
				
			emit('update:modelValue', lnglat, result.regeocode);
			emit('change', lnglat, result.regeocode);

			formItem?.change?.(currentValue.value);
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

		const handleMapClick = async (e, isFake) => {
			const lnglat = isFake ? e : [e.lnglat.getLng(), e.lnglat.getLat()];

			mapAssist.marker.setPosition(lnglat);

			if (mapAssist.infoWindow.getIsOpen()) {
				mapAssist.infoWindow.setPosition(lnglat);
			} else {
				mapAssist.infoWindow.open(mapAssist.instance, lnglat);
			}

			const result = await regeoCode(lnglat);
			mapAssist.infoWindow.setContent(
				`<div>${result.regeocode.formattedAddress}</div>`
			);
			
			isFake && mapAssist.instance.setCenter(lnglat);
			!isFake && sync(result, lnglat);
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

			if (currentValue.value.length) {
				handleMapClick(currentValue.value, true);
			}

			AMapUI.loadUI(['misc/PoiPicker'], (PoiPicker) => {
				const picker = new PoiPicker({
					input: props.searchInputId,
					placeSearchOptions: {
						map: e.target,
						city: 'auto',
						pageSize: 10
					},
					searchResultsContainer: props.searchResultsId,
					suggestContainer: props.searchResultsId
				});
				picker.on('poiPicked', async (poiResult) => {
					picker.hideSearchResults();

					if (poiResult.source !== 'search') {
						picker.searchByKeyword(poiResult.item.name);
					}
					const { lng, lat } = poiResult.item.location;
					const result = await regeoCode([lng, lat]);
					sync(result, [lng, lat]);
				});
				mapAssist.poiPicker = picker;
			});
		};

		const handleMapSearch = (e) => {
			if (e.keyCode == 13 || e.keyCode == 108) {
				mapAssist.poiPicker.searchByKeyword(currentSearch.value);
			}
		};

		watch(() => props.modelValue, (v) => {
			if (
				v.length !== currentValue.value.length 
				|| v[0] != currentValue.value[0] 
				|| v[1] != currentValue.value[1]
			) {
				currentValue.value = v;
				 // 如果存在经纬度，说明已经设置过地址，直接点标记展示即可
				if (currentValue.value.length && mapAssist.instance) {
					handleMapClick(v, true);
				}
			}
		}, { immediate: true });

		return {
			currentValue,
			currentSearch,
			mapAssist,
			handleMapReady,
			handleMapClick,
			handleMapSearch
		};
	}
});
</script>
