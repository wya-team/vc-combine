<template>
	<vcc-paging-core
		:data-source="listInfo.data"
		:load-data="rebuildLoadData"
		:total="listInfo.total"
		:count="listInfo.count"
		:reset-by-current="listInfo.resetByCurrent"
		:page-options="pageOptions"
		:table-options="tableOptions"
		:history="true"
		:disabled="disabled"
		style="width: 100%;"
		v-on="listeners"
	>
		<slot />s
	</vcc-paging-core>
</template>
<script>
import { ref, reactive, defineComponent, computed, onMounted, getCurrentInstance } from 'vue';
import { useListeners } from './use-listeners';
import PagingCore from './core.vue';

const initPage = () => ({
	resetByCurrent: false,
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
		disabled: Boolean,
		pageOptions: Object,
		tableOptions: Object,
		loadData: Function
	},
	emits: ['page-size-change'],
	setup(props, { emit }) {
		const listInfo = ref(initPage());
		const instance = getCurrentInstance();
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

		const reset = (force) => {
			// 回到首页刷新
			if (force) {
				listInfo.value = initPage();
				return;
			}

			// 当前页刷新
			listInfo.value = {
				...initPage(),
				resetByCurrent: true,
			};
		};

		const listeners = useListeners();
		return {
			listeners,
			listInfo,
			rebuildLoadData,

			reset
		};
	}
});
</script>
