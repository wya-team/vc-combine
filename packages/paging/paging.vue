<template>
	<div class="vcc-paging">
		<vcc-paging-filter 
			v-if="filterOptions && filterOptions.modules && filterOptions.modules.length" 
			style="margin-bottom: 12px;"
			:history="mergeProps.history"
			:router="mergeProps.router"
			v-bind="filterOptions"
			@search="handleSearch"
		/>
		<vcc-paging-core
			ref="core"
			v-model:current="currentPage"
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
			:single="single"
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
import { provide, inject, ref, watch, defineComponent, computed, onMounted, onBeforeUnmount, getCurrentInstance } from 'vue';
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
		current: [Number, String],
		filterOptions: Object,
		max: Number,
		single: Boolean
	},
	emits: ['page-size-change', 'search'],
	setup(props, { emit }) {
		const group = inject('paging-group', {});
		const core = ref(null);
		const table = ref(null);
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
			if (!res) {
				// 无数据返回
				return;
			}

			let body = {};
			if (res.data instanceof Array) {
				body.list = res.data;
				body.page = {
					current: 1,
					total: 1,
					count: res.data.length,
				};
			} else {
				body = res.data || res;
			}

			if (!body || !body.page || !(body.list instanceof Array)) {
				// 约定格式错误
				return;
			}

			listInfo.value = {
				...listInfo.value,
				...body.page,
				data: {
					...listInfo.value.data,
					[$page]: body.list
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

		const handleSearch = (...rest) => {
			emit('search', ...rest);
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

		const currentPage = ref(props.current);
		watch(
			() => props.current, 
			() => {
				currentPage.value = props.current;
			}
		);

		onMounted(() => {
			group?.add?.(instance);
			table.value = core.value?.table;
		});

		onBeforeUnmount(() => {
			group?.remove?.(instance);
		});

		provide('paging', {
			listInfo,
			reset,
			table,
			core
		});

		return {
			currentPage,
			listInfo,
			pagingHooks,
			mergeProps,
			rebuildLoadData,
			handleSearch,
			reset,
			core,
			table
		};
	}
});
</script>
