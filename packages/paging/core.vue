<template>
	<div class="vcc-paging-core">
		<!-- 原生table -->
		<table v-if="mode === 'native'" class="vcc-paging-core__native">
			<thead>
				<slot v-bind="columns" name="header">
					<th v-for="item in columns" :key="item">
						{{ item }}
					</th>
				</slot>
			</thead>
			<slot :data-source="data" />
		</table>

		<!-- 没有头部栏的header -->
		<!-- 项目中统一使用it, key由slot决定 -->
		<template v-for="(item, index) in data" v-else-if="mode === 'piece'">
			<slot :it="item" :index="index" />
		</template>
	
		<vc-radio-group 
			v-else-if="selectable && primaryKey && max == 1" 
			:model-value="selection[0] && selection[0][primaryKey]" 
			:fragment="!selectable || !primaryKey || max != 1"
			style="width: 100%;"
			v-bind="radioGroupOptions"
			@change="handleRadioChange"
		>
			<vc-table
				ref="table" 
				:data-source="data" 
				v-bind="rebuildTableOptions"
				v-on="tableHooks"
			>
				<template #default>
					<template v-if="selectable && primaryKey">
						<vc-table-column
							v-if="max > 1"
							type="selection"
							v-bind="tableColumnOptions"
						/>
						<vc-table-column 
							width="80"
							v-bind="tableColumnOptions"
						>
							<template #default="{ row }">
								<vc-radio
									:label="row[primaryKey]"
									v-bind="radioOptions"
								>
									{{ '' }}
								</vc-radio>
							</template>
						</vc-table-column>
					</template>
					<slot />
				</template>
				<template #append>
					<slot name="append" />
				</template>
				<template #empty>
					<slot name="empty" />
				</template>
			</vc-table>
		</vc-radio-group>
		<vc-table
			v-else
			ref="table" 
			:data-source="data" 
			v-bind="rebuildTableOptions"
			v-on="tableHooks"
		>
			<template #default>
				<template v-if="selectable && primaryKey">
					<vc-table-column
						v-if="max > 1"
						type="selection"
						v-bind="tableColumnOptions"
					/>
				</template>
				<slot />
			</template>
			<template #append>
				<slot name="append" />
			</template>
			<template #empty>
				<slot name="empty" />
			</template>
		</vc-table>
		<div v-if="footer" class="vcc-paging-core__footer">
			<div>
				<vc-checkbox
					v-if="selectable && primaryKey && max > 1"
					:model-value="checkedStatus == 1"
					:indeterminate="checkedStatus == 2"
					:disabled="!data.length"
					class="vcc-paging-core__checkbox"
					@change="handleSelectionAll"
				>
					<span class="vcc-paging-core__checkbox--label">全选</span>
				</vc-checkbox>
				<slot name="extra" />
			</div>
			<div v-if="!single">
				<slot 
					v-if="$slots.page"
					:total="total"
					:count="count"
					:current="currentPage" 
					name="page"
				/>
				<vc-page
					v-else
					ref="page"  
					:count="Number(count)" 
					:current="currentPage"
					:page-size="pageSize"
					v-bind="pageOptions"
					@change="handleChange"
					@page-size-change="handleChangePageSize"
				/>
			</div>
		</div>
	</div>
</template>
<script>
import { reactive, inject, defineComponent, ref, computed, watch, getCurrentInstance, onMounted, nextTick } from 'vue';
import { Table, Page, VcInstance, Checkbox, Radio } from '@wya/vc';
import { URL, Storage } from '@wya/utils';
import { useListeners } from './use-listeners';

let localPageSize = 0;
let localPageSizeKey = '@wya/vc.paging.localPageSize';

Storage.get(localPageSizeKey);

export default defineComponent({
	name: "vcc-paging-core",
	components: {
		'vc-table': Table,
		'vc-table-column': Table.Column,
		'vc-radio-group': Radio.Group,
		'vc-radio': Radio,
		'vc-page': Page,
		'vc-checkbox': Checkbox
	},
	props: {
		// checkedKeys -> modelValue
		modelValue: {
			type: Array,
			default: () => ([])
		},
		// ---- table 组件属性 start, 其他属性使用$attrs
		dataSource: {
			type: Object,
			default() {
				return {};
			}
		},
		tableOptions: {
			type: Object,
			default: () => (VcInstance.config?.Paging?.tableOptions || {})
		},
		tableColumnOptions: Object,
		radioOptions: Object,
		radioGroupOptions: Object,
		columns: Array, // native table
		// ---- end
		// ---- page 组件属性 start
		pageOptions: {
			type: Object,
			default: () => (VcInstance.config?.Paging?.pageOptions || {
				showCount: true,
				showSizer: true,
				showElevator: true,
				placement: 'top',
				pageSizeOptions: [10, 20, 30, 50, 100]
			})
		},
		// ---- end
		// 是否从url中获取page
		history: {
			type: Boolean,
			default: false
		},
		router: {
			type: [Boolean, Object],
			default: false
		},
		current: [Number, String],
		mode: {
			type: String,
			validator(value) {
				return ['native', 'piece', 'table'].indexOf(value) !== -1;
			},
			default: 'table'
		},
		disabled: {
			type: Boolean,
			default: false
		},
		resetByCurrent: Boolean,
		total: {
			type: Number,
			default: 0
		},
		count: {
			type: [String, Number],
			default: 0
		},
		// 数据加载
		loadData: {
			type: Function,
			required: true
		},
		footer: {
			type: Boolean,
			default: false
		},
		controls: {
			type: Object,
			default: () => ({
				pageSize: true
			})
		},
		rowKey: {
			type: String
		},

		// 多选，单选， max: 1 单选
		max: {
			type: Number,
			default: Infinity
		},

		// 单页
		single: {
			type: Boolean,
			default: false
		},

		selectable: {
			type: Boolean,
			default: false
		}
	},
	emits: [
		'page-size-change', 
		'load-pending', 
		'load-fail', 
		'load-success', 
		'load-finish',
		'page-change',
		'update:current',
		'sort-change',
		'row-click',
		'selection-change'
	],
	setup(props, { emit }) {
		const group = inject('paging-group', {});
		const { globalProperties } = getCurrentInstance().appContext.config;
		let { query: $query = {} } = URL.parse();
		let { pageSizeOptions } = props.pageOptions; // eslint-disable-line
		const defaultPageSize = Number(
			$query.pageSize
			|| (props.controls.pageSize && localPageSize)
			|| (pageSizeOptions && pageSizeOptions[0]) 
			|| 10
		);

		const table = ref(null);
		const loading = ref(false);
		const currentPage = ref(!props.disabled ? Number($query.page || 1) : 1);
		const pageSize = ref(defaultPageSize);
		// 当前选择的
		const selection = ref([]);
		
		const defaultSort = reactive({
			prop: $query.sortField || props.tableOptions?.defaultSort?.prop,
			order: $query.sortOrder || props.tableOptions?.defaultSort?.order
		});

		const rebuildTableOptions = computed(() => {
			return Object.assign(props.tableOptions, { defaultSort });
		});
		const primaryKey = computed(() => {
			return props.rowKey || props.tableOptions.rowKey;
		});

		const data = computed(() => {
			let result = props.dataSource[currentPage.value];
			return result || [];
		});

		const checkedStatus = computed(() => {
			if (!data.value) return 3;
			const rowKey = primaryKey.value;
			const temp = data.value.filter(row => {
				return selection.value.findIndex(it => it[rowKey] === row[rowKey]) > -1;
			});
			return temp.length
				? (temp.length === data.value.length ? 1 : 2)
				: 3;
		});

		let reSelecting = false;
		const toggleSelection = (rows, status) => {
			reSelecting = !!rows.length;

			rows.forEach((item, index) => nextTick(() => {
				table.value.toggleRowSelection(item, status);
				if (index === rows.length - 1) {
					reSelecting = false;
				}
			}));
		};
		const resetSelection = (isLoaded) => {
			const rowKey = primaryKey.value;
			if (!rowKey) return;
			if (data.value.length && selection.value.length) {
				let rows = [];
				const rowKeyValues = selection.value.map(item => item[rowKey]);
				data.value.forEach((row, index) => {
					if (rowKeyValues.includes(row[rowKey])) {
						rows.push(row);
					}
				});

				isLoaded && emit('selection-change', selection.value, rows);
				toggleSelection(rows, true);
			}
		};

		const handleRowClick = (row) => {
			const rowKey = primaryKey.value;
			if (props.selectable && rowKey && props.max == 1) {
				selection.value = [row];
				emit('selection-change', selection.value, selection);
			}
			emit('row-click', row);
		};

		const handleRadioChange = (id) => {
			const rowKey = primaryKey.value;
			let row = data.value.find(i => i[rowKey] == id);

			selection.value = [row];
			emit('selection-change', selection.value, selection);
		};

		const handleSelectionChange = ($selection) => {
			const rowKey = primaryKey.value;
			if (!rowKey) return emit('selection-change', $selection, $selection);

			const dataSelectionValues = data.value.map(item => item[rowKey]);
			const rowKeyValues = $selection.map(item => item[rowKey]);
			// 过滤掉当前页面的选择的数据，再合并当前页面选择的数据
			selection.value = selection.value
				.filter(item => {
					return !dataSelectionValues.includes(item[rowKey]);
				})
				.filter(item => {
					return !rowKeyValues.includes(item[rowKey]);
				})
				.concat($selection);

			!reSelecting && emit('selection-change', selection.value, selection);
		};

		const handleSelectionAll = (v) => {
			table.value.toggleAllSelection();
		};

		const setCurrentPage = ($page) => {
			currentPage.value = $page;
			emit('update:current', $page);

			// 给外部触发
			emit('page-change', $page);
		};

		const loadData = ($page, $pageSize = pageSize.value) => {
			// set-page
			currentPage.value !== 0 && setCurrentPage($page);

			// 是否已有数据
			let arr = props.dataSource[$page];
			if (arr && typeof arr.length === 'number') {
				resetSelection(true);
				return;
			}

			// 请求
			const load = props.loadData($page, $pageSize);
			if (load && load.then) {
				loading.value = true;
				emit('load-pending');
				load.then((res) => {
					emit('load-success', res);
					resetSelection(false);
					return res;
				}).catch((res) => {
					emit('load-fail', res);
					return Promise.reject(res);
				}).finally(() => {
					loading.value = false;
					currentPage.value === 0 && setCurrentPage($page);
					emit('load-finish');
				});
			} else {
				console.error('[vc-paging]-loadData need return a Promise');
			}
		};

		const routerReplace = async (fullPath) => {
			if (globalProperties.$router && props.router) {
				await globalProperties.$router.replace(fullPath);
			} else {
				window.history.replaceState(null, null, fullPath);
			}
		};

		const handleChange = async ($page, $pageSize = pageSize.value) => {
			// this.$emit('page-change', page);
			$page = $page || 1;
			if (props.history) {
				let { path, query } = URL.parse();
				let fullPath = URL.merge({
					path,
					query: {
						...query,
						page: $page,
						pageSize: $pageSize
					}
				});

				await routerReplace(fullPath);
			}
			loadData($page, $pageSize);
		};

		const handleChangePageSize = ($pageSize) => {
			emit('page-size-change', $pageSize); // 清理数据
			pageSize.value = $pageSize;

			localPageSize = $pageSize;

			Storage.set(localPageSizeKey, $pageSize);
		};

		const handleSortChange = async (e) => {
			const { prop, order } = e;

			defaultSort.prop = prop;
			defaultSort.order = order;

			if (props.history) {
				const route = URL.parse();
				let fullPath = URL.merge({
					path: route.path,
					query: {
						...route.query,
						sortField: prop,
						sortOrder: order,
					}
				});

				await routerReplace(fullPath);
			}
			emit('sort-change', e);
		};

		const listeners = useListeners();
		const tableHooks = computed(() => {
			return {
				...listeners.value,
				// 由内部触发
				'row-click': handleRowClick,
				'selection-change': handleSelectionChange,
				'sort-change': handleSortChange
			};
		});

		watch(
			() => props.modelValue,
			(v) => {
				const rowKey = primaryKey.value;
				if (!props.selectable || !rowKey) {
					return;
				}

				if (selection.value !== v) {
					// 尽量不要传id
					if (v.some(i => typeof i !== 'object')) {
						v = v.map(i => {
							return {
								[rowKey]: i
							};
						});
					}

					selection.value = v;
				}
			},
			{
				immediate: true
			}
		);

		watch(
			() => props.disabled,
			(v) => {
				if (v) return;
				// tabs切换时保持pageSize不变
				let { query } = URL.parse();
				if (pageSize.value != query.pageSize) {
					pageSize.value = Number(
						query.pageSize 
						|| (props.controls.pageSize && localPageSize) 
						|| defaultPageSize
					);
				}
				
				// 触发
				handleChange(currentPage.value);
			}
		);

		watch(
			() => props.dataSource,
			() => {
				let $page = props.resetByCurrent === true 
					? currentPage.value // 当前页刷新
					: 1; // 首页刷新
				if (props.count === 0) {
					currentPage.value = 0;
					!props.disabled && handleChange($page);
				}
			}
		);

		onMounted(() => {
			let { query: { page: $page = 1 } } = URL.parse();

			// 首次加载的时候特殊处理, 选择卡切换时，需要重置到第1页
			!props.disabled && loadData(
				props.history && (!group.pagings || group.pagings.length === 0)
					? $page 
					: 1
			);
		});

		return {
			table,
			loading,
			currentPage,
			data,
			pageSize,
			primaryKey,
			rebuildTableOptions,
			
			tableHooks,
			selection,
			checkedStatus,

			handleRowClick,
			handleSelectionChange,
			handleChangePageSize,
			handleChange,
			handleSelectionAll,
			handleRadioChange,

			defaultSort,

			// 外部调用
			go: handleChange
		};
	}
});
</script>
<style lang="scss">
.vcc-paging-core {
	&__native {
		border-collapse: collapse;
	}

	&__footer {
		display: flex;
		width: 100%;
		padding: 32px 0 0 0;
		justify-content: space-between;
		align-items: center;
	}

	&__checkbox {
		padding-left: 26px;

		&--label {
			padding-left: 12px;
		}
	}
}
</style>