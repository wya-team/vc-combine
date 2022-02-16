<template>
	<div class="vcc-paging-group">
		<vcc-paging-filter 
			v-if="filterOptions && filterOptions.modules && filterOptions.modules.length" 
			style="margin-top: 12px; margin-bottom: 12px;"
			:history="history"
			:router="router"
			v-bind="filterOptions"
			@search="handleSearch"
		/>
		<slot />
	</div>
</template>
<script>
import { provide, defineComponent } from 'vue';
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
	emits: ['click', 'change'],
	setup(props, { emit }) {
		const fields = [];
		provide('paging-group', {
			props,
			add: (item) => {
				item && fields.push(item);
			},
			remove: (item) => {
				item.props.prop && fields.splice(fields.indexOf(item), 1);
			}
		});
		const reset = (force) => {
			fields.forEach(i => i.proxy.reset(force));
		};

		const handleSearch = () => {
			reset(1);
		};

		return {
			handleSearch,
			reset
		};
	}
});
</script>
