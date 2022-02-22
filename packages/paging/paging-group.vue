<template>
	<div class="vcc-paging-group">
		<vcc-paging-filter 
			v-if="filterOptions && filterOptions.modules && filterOptions.modules.length" 
			style="margin-bottom: 12px;"
			:history="history"
			:router="router"
			v-bind="filterOptions"
			@search="handleSearch"
		/>
		<slot />
	</div>
</template>
<script>
import { provide, reactive, defineComponent, computed } from 'vue';
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

		provide('paging-group', {
			props,
			pagings,
			current, // 有且仅一个激活
			add: (item) => {
				item && pagings.push(item);
			},
			remove: (item) => {
				item.props.prop && pagings.splice(pagings.indexOf(item), 1);
			},
			reset
		});

		return {
			handleSearch,
			pagings,
			current,
			reset
		};
	}
});
</script>
