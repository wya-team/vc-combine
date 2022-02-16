<template>
	<vcc-paging-core
		:data-source="listInfo.data"
		:load-data="rebuildLoadData"
		:total="listInfo.total"
		:count="listInfo.count"
		:reset="listInfo.reset"
		:page-options="pageOptions"
		:table-options="tableOptions"
		:history="true"
		:show="show"
		style="width: 100%;"
		@page-size-change="() => handleReset(1)"
		@sort-change="handleSortChange"
	>
		<slot />
	</vcc-paging-core>
</template>
<script>
import { ref, reactive, defineComponent } from 'vue';
import PagingCore from './core.vue';

const initPage = () => ({
	reset: false,
	current: 0,
	total: 0,
	count: 0,
	data: {

	}
});


export default defineComponent({
	name: "vcc-paging-basic",
	components: {
		'vcc-paging-core': PagingCore,
	},
	props: {
		show: Boolean,
		pageOptions: Object,
		tableOptions: Object,
		loadData: Function
	},
	emits: ['sort-change'],
	setup(props, { emit }) {
		const show = ref(true);
		const listInfo = ref(initPage());
		const page = ref(undefined);
		const table = reactive({
			defaultSort: {
				prop: 'date',
				order: 'descending'
			}
		});

		const rebuildLoadData = async ($page, pageSize) => {
			const res = await props.loadData($page, pageSize);
			if (!res || !res.data) {
				return;
			}
			listInfo.value = {
				...listInfo.value,
				...res.data.page,
				data: {
					...listInfo.value.data,
					[$page]: res.data.list
				}
			};
		};

		const handleReset = (force) => {
			/**
			 * 回到首页刷新
			 */
			if (force) {
				listInfo.value = initPage();
				return;
			}

			/**
			 * 当前页刷新
			 */
			listInfo.value = {
				...initPage(),
				reset: true,
			};
		};

		const handleSortChange = (...rest) => {
			emit('sort-change', ...rest);
		};

		return {
			listInfo,
			rebuildLoadData,
			handleSortChange,
			handleReset,

			// 外部使用
			reset: handleReset,
		};
	}
});
</script>
