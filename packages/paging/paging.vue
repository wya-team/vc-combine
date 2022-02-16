<template>
	<div class="vcc-paging">
		<vcc-paging-filter 
			v-if="filters && filters.length" 
			style="margin-top: 12px; margin-bottom: 12px;"
			:filters="filters"
			:history="mergeProps.history"
			:router="mergeProps.router"
			@search="handleSearch"
		/>
		<vcc-paging-core
			:data-source="listInfo.data"
			:total="listInfo.total"
			:count="listInfo.count"
			:reset-by-current="listInfo.resetByCurrent"
			:page-options="pageOptions"
			:table-options="tableOptions"
			:columns="columns"
			:mode="mode"
			:disabled="disabled"
			:load-data="rebuildLoadData"
			:controls="controls"
			:row-key="rowKey"
			v-bind="mergeProps"
			style="width: 100%;"
			v-on="pagingHooks"
		>
			<template #extra>
				<slot name="extra" />
			</template>
			<template #append>
				<slot name="append" />
			</template>
			<template #empty>
				<slot name="empty" />
			</template>
			<slot />
		</vcc-paging-core>
	</div>
</template>
<script lang="js">
import { inject, ref, defineComponent, computed, onMounted, onBeforeUnmount, getCurrentInstance } from 'vue';
import PagingFilter from './filter.vue';
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
	name: "vcc-paging",
	components: {
		'vcc-paging-core': PagingCore,
		'vcc-paging-filter': PagingFilter
	},
	props: {
		columns: Array,
		tableOptions: Object,
		pageOptions: Object,
		history: Boolean,
		router: [Boolean, Object],
		mode: String,
		disabled: Boolean,
		loadData: Function,
		footer: Boolean,
		controls: Object,
		rowKey: String,

		filters: Array
	},
	emits: ['page-size-change'],
	setup(props, { emit }) {
		const group = inject('paging-group', {});

		const listInfo = ref(initPage());
		const instance = getCurrentInstance();

		const mergeProps = computed(() => {
			return ['history', 'router', 'footer'].reduce((pre, key) => {
				pre[key] = props[key] || group?.props?.[key];
				return pre;
			}, {});
		});

		const rebuildLoadData = async ($page, pageSize) => {
			let fn = props.loadData || group?.props?.loadData; 
			const res = await fn($page, pageSize);
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

		const handleSearch = () => {
			reset(1);
		};

		const listeners = useListeners();
		const pagingHooks = computed(() => {
			return {
				...listeners.value,
				'page-size-change': (e) => {
					reset(1);
					emit('page-size-change', e);
				} 
			};
		});

		onMounted(() => {
			group?.add?.(instance);
		});

		onBeforeUnmount(() => {
			group?.remove?.(instance);
		});

		return {
			listInfo,
			pagingHooks,
			mergeProps,
			rebuildLoadData,
			handleSearch,
			reset,
		};
	}
});
</script>
