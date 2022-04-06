<template>
	<div class="vcc-paging-group">
		<vcc-paging-filter 
			v-if="filterOptions && filterOptions.modules && filterOptions.modules.length" 
			ref="filter"
			style="margin-bottom: 12px;"
			:history="history"
			:router="router"
			v-bind="filterOptions"
			@search="handleSearch"
		>
			<template #extra>
				<slot name="filter-extra" />
			</template>
		</vcc-paging-filter>
		<slot />
	</div>
</template>
<script>
import { ref, provide, reactive, defineComponent, computed } from 'vue';
import PagingFilter from './filter.vue';

export default defineComponent({
	name: "vcc-paging-group",
	components: {
		'vcc-paging-filter': PagingFilter
	},
	props: {
		// columns: Array,
		// tableOptions: Object,
		// pageOptions: Object,
		// mode: String,
		// disabled: Boolean,
		// controls: Object,
		// rowKey: String,
		
		history: Boolean,
		router: [Boolean, Object],
		footer: Boolean,
		loadData: Function,
		filterOptions: Object
	},
	emits: ['click', 'change', 'search'],
	setup(props, { emit }) {
		const pagings = reactive([]);
		const filter = ref(null);

		const reset = (force) => {
			pagings.forEach(i => i.proxy.reset(force));
		};

		const current = computed(() => {
			return pagings.find(i => !i.props.disabled);
		});

		const handleSearch = (...rest) => {
			reset(1);
			emit('search', ...rest);
		};

		const getCurrentData = (all = false) => {
			const listInfo = current?.value?.proxy?.listInfo;
			return all 
				? listInfo
				: (listInfo.data[listInfo.current || 1] || []);
		};

		const getData = (all = false) => {
			return pagings.map(i => {
				const listInfo = i?.proxy?.listInfo;
				return all 
					? listInfo
					: (listInfo.data[listInfo.current || 1] || []);
			});
		};

		provide('paging-group', {
			props,
			pagings,
			current, // 有且仅一个激活
			filter,
			add: (item) => {
				item && pagings.push(item);
			},
			remove: (item) => {
				item.props.prop && pagings.splice(pagings.indexOf(item), 1);
			},
			reset,
			getCurrentData,
			getData
		});

		return {
			filter,
			handleSearch,
			pagings,
			current,
			reset,
			getData,
			getCurrentData
		};
	}
});
</script>
