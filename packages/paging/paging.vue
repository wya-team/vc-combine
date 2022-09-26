<template>
	<div class="vcc-paging">
		<vcc-paging-filter 
			v-if="filterOptions && filterOptions.modules && filterOptions.modules.length" 
			ref="filter"
			style="margin-bottom: 12px;"
			:history="mergeProps.history"
			:router="mergeProps.router"
			v-bind="filterOptions"
			@search="handleSearch"
		>
			<template #extra>
				<slot name="filter-extra" />
			</template>
		</vcc-paging-filter>
		<vcc-paging-core
			ref="core"
			v-model:current="currentPage"
			:model-value="currentSelected"
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
			:selectable="selectable"
			:max="max"
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
			<template v-if="mode === 'native'" #header>
				<slot name="header">
					<th v-for="item in columns" :key="item">
						{{ item }}
					</th>
				</slot>
			</template>
			<template #default="it">
				<slot v-if="['piece', 'native'].includes(mode)" v-bind="it" />
				<slot v-else />
			</template>		
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
		modelValue: Array,
		columns: { // native table
			type: Array,
			default: () => ([])
		},
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
		single: Boolean,
		paginate: Boolean, // 当返回数据为[]时，是否需要有分页器（通常避免一次性展示过多）
		selectable: Boolean,
		allowSelectionKeep: {
			type: Boolean,
			default: false
		}
	},
	emits: ['page-size-change', 'sort-change', 'search', 'update:model-value'],
	setup(props, { emit }) {
		const group = inject('paging-group', {});
		const core = ref(null);
		const table = ref(null);
		const filter = ref(null);
		const currentSelected = ref([]);
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
			if (res.data instanceof Array || res instanceof Array) {
				let data = res.data || res;
				if (!props.paginate) {
					body.list = data;
					body.page = {
						current: 1,
						total: 1,
						count: data.length,
					};
				} else {
					// 返回数据为数组时需要分页的场景
					let start = ($page - 1) * pageSize;
					body.list = data.slice(start, start + pageSize);
					body.page = {
						current: $page,
						total: Math.ceil(data.length / pageSize),
						count: data.length,
					};
				}
				
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
			if (!props.allowSelectionKeep) {
				currentSelected.value = [];
				emit('update:model-value', []);
			}

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

		const getData = (all = false) => {
			return all 
				? listInfo.value
				: (listInfo.value.data[listInfo.value.current || 1] || []);
		};

		const handleSearch = (...rest) => {
			emit('search', ...rest);
			reset(1);
		};

		const listeners = useListeners();
		const pagingHooks = computed(() => {
			return {
				...listeners.value,
				'update:model-value': (e) => {
					currentSelected.value = e;
					emit('update:model-value', e);
				},
				'sort-change': (e) => {
					emit('sort-change', e);
					// 先emit，再reset
					reset(1);
				},
				'page-size-change': (e) => {
					emit('page-size-change', e);
					// 先emit，再reset
					reset(1);
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

		watch(
			() => props.modelValue, 
			(v) => {
				if (typeof v !== 'object' || !v) {
					currentSelected.value = [];
					return;
				}

				if (v !== currentSelected.value) {
					currentSelected.value = v instanceof Array ? v : [v];
				}
			},
			{
				immediate: true
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
			core,
			filter,
			getData
		});

		return {
			filter,
			currentSelected,
			currentPage,
			listInfo,
			pagingHooks,
			mergeProps,
			rebuildLoadData,
			handleSearch,
			reset,
			core,
			table,
			getData
		};
	}
});
</script>
