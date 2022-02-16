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
	
		<!-- TODO loading 包着table -->
		<vc-table
			v-else 
			ref="table" 
			:data-source="data" 
			v-bind="tableOptions"
			v-on="tableHooks"
		>
			<template #default>
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
				<slot name="extra" />
			</div>
			<div>
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
import { defineComponent, ref, computed, watch, getCurrentInstance, onMounted } from 'vue';
import { Table, Page, VcInstance } from '@wya/vc';
import { URL, Storage } from '@wya/utils';
import { useListeners } from './use-listeners';

let localPageSize = 0;
let localPageSizeKey = '@wya/vc.paging.localPageSize';

Storage.get(localPageSizeKey);

export default defineComponent({
	name: "vcc-paging-core",
	components: {
		'vc-table': Table,
		'vc-page': Page
	},
	props: {
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
		// current: [Number, String], // .sync可以不声明；需要使用this.current, 必须声明
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
		'sort-change'
	],
	setup(props, { emit }) {
		const { globalProperties } = getCurrentInstance().appContext.config;
		let { query: { page = 1, pageSize: _pageSize } } = URL.parse();
		let { pageSizeOptions } = props.pageOptions; // eslint-disable-line
		const defaultPageSize = Number(
			_pageSize
			|| (props.controls.pageSize && localPageSize)
			|| (pageSizeOptions && pageSizeOptions[0]) 
			|| 10
		);

		const loading = ref(false);
		const currentPage = ref(!props.disabled ? Number(page) : 1);
		const pageSize = ref(defaultPageSize);
		const selection = ref([]);
		const hasTabsClick = ref(false); // TODO
		
		const data = computed(() => {
			let result = props.dataSource[currentPage.value];
			return result || [];
		});

		const handleSelectionChange = () => {
			// TODO
		};

		const resetSelection = () => {
			// TODO
		};

		const listeners = useListeners();
		const tableHooks = computed(() => {
			return {
				...listeners.value,
				// 由内部触发
				'selection-change': handleSelectionChange
			};
		});

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

		const handleChange = ($page, $pageSize = pageSize.value) => {
			// this.$emit('page-change', page);
			$page = $page || 1;
			if (props.history) {
				let { path, query } = URL.parse();
				let config = URL.merge({
					path,
					query: {
						...query,
						page: $page,
						pageSize: $pageSize
					}
				});
				// 同步vue-router，this.$route
				(globalProperties.$router && props.router)
					? globalProperties.$router.replace(config)
					: window.history.replaceState(null, null, config);
			}
			loadData($page, $pageSize);
		};

		const handleChangePageSize = ($pageSize) => {
			emit('page-size-change', $pageSize); // 清理数据
			pageSize.value = $pageSize;

			localPageSize = $pageSize;

			Storage.set(localPageSizeKey, $pageSize);

			handleChange(1, $pageSize);
		};

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
				handleChange(currentPage);
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
			/**
			 * 首次加载的时候特殊处理
			 * !props.disabled的情况下才去加载
			 * 页数history -> true 且未点击过tabs时为当前的page
			 * 其他：适配ssr, 需要把请求放入到mounted
			 */
			!props.disabled && loadData(props.history && !hasTabsClick.value ? $page : 1);
		});

		return {
			loading,
			currentPage,
			data,
			pageSize,
			
			tableHooks,
			selection,

			handleSelectionChange,
			handleChangePageSize,
			handleChange,

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
}
</style>