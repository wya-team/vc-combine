<template>
	<div class="vcc-paging-filter">
		<div v-if="outerModules.length">
			<vcc-paging-filter-item
				v-for="item in outerModules"
				:key="getVForKey(item)"
				:module="item"
				:get-model-value="getModelValue"
				:on-model-value-change="onModelValueChange"
				label-width="auto"
				class="vcc-paging-filter__item is-outer"
				@search="handleSearch"
			/>
			<vc-button
				type="primary"
				class="vcc-paging-filter__search-btn"
				@click="handleSearch"
			>
				查询
			</vc-button>
			<span
				v-if="showExpand"
				class="vcc-paging-filter__expand-switch"
				@click="handleToggle"
			>
				{{ isExpand ? '收起' : '展开' }}
				<vc-icon :type="isExpand ? 'triangle-up' : 'triangle-down'" />
			</span>
			<slot name="extra" />
		</div>
		<vc-expand v-if="showExpand" v-model="isExpand">
			<div class="vcc-paging-filter__expand-modules">
				<vcc-paging-filter-item
					v-for="item in innerModules"
					:key="getVForKey(item)"
					:module="item"
					:get-model-value="getModelValue"
					:on-model-value-change="onModelValueChange"
					:label-width="labelWidth"
					class="vcc-paging-filter__item"
					@search="handleSearch"
				/>
			</div>
		</vc-expand>
	</div>
</template>

<script lang="ts">
import type { ComponentInternalInstance, PropType } from 'vue';
import {
	ref,
	reactive,
	computed,
	getCurrentInstance,
	provide,
	onBeforeUnmount,
	defineComponent
} from 'vue';
import { Button, Expand, Icon } from '@wya/vc';
import { URL } from '@wya/utils';
import { debounce } from 'lodash';
import type {
	Modules,
	Module,
	ModuleWithField,
	FilterModuleField,
	FilterManager,
	FilterFieldCtx,
	FieldMap
} from './filter-types';
import { useModules } from './hooks';
import FilterItem from './filter-item.vue';
import { FILTER_KEY } from './constants';

export default defineComponent({
	name: 'vcc-paging-filter',
	components: {
		'vc-button': Button,
		'vc-expand': Expand,
		'vc-icon': Icon,
		'vcc-paging-filter-item': FilterItem
	},
	props: {
		modules: {
			type: Array as PropType<Modules>,
			default: () => []
		},
		outerCount: {
			type: Number,
			default: 1
		},
		history: Boolean,
		router: Boolean
	},
	emits: ['search'],
	setup(props, { emit, expose }) {
		// 表示是否即将卸载组件（比如路由跳转导致卸载）
		let willUnmount = false;
		const vm = getCurrentInstance() as ComponentInternalInstance;
		const fieldMap: FieldMap = new Map();

		// module项可通过‘show'字段控制是否展示，show=true或者不设置show字段则展示
		const enableModules = computed(() => props.modules.filter(it => it.show !== false));

		const outerModules = computed(() => enableModules.value.slice(0, props.outerCount));
		const innerModules = computed(() => enableModules.value.slice(props.outerCount));
		const showExpand = computed(() => enableModules.value.length > props.outerCount);

		const getVForKey = (module: Module) => {
			return String(module.type === 'range' ? module.children[0].field : (module as ModuleWithField).field);
		};

		let isExpand = ref(false);

		const {
			keywords,
			labelWidth,
			getModelValue,
			onModelValueChange
		} = useModules(props, enableModules);

		const routerReplace = async (fullPath: string) => {
			const { globalProperties } = vm.appContext.config;
			if (globalProperties.$router && props.router) {
				await globalProperties.$router.replace(fullPath);
			} else {
				window.history.replaceState(window.history.state, '', fullPath);
			}
		};

		const replaceQuery = async (overrideQuery = {}) => {
			if (props.history) {
				const route = URL.parse();
				let query = {
					...route.query,
					...keywords.value,
					...overrideQuery
				};
				await routerReplace(URL.merge({
					path: route.path.join('/'),
					query
				}));
			}
		};

		const handleSearch = debounce(async () => {
			await replaceQuery();
			emit('search', keywords.value);
		}, 300);

		const handleToggle = () => {
			isExpand.value = !isExpand.value;
		};

		const addField = (field: FilterModuleField, fieldCtx: FilterFieldCtx) => {
			fieldMap.set(field, fieldCtx);
		};

		const removeField = async (field: FilterModuleField) => {
			// 如果即将卸载组件，就不进行后续操作
			if (willUnmount) return;

			fieldMap.delete(field);
			// 用于覆盖query上的相应字段，置为''，达到清除效果
			const overrideQuery = {};
			if (Array.isArray(field)) {
				field.forEach(it => {
					overrideQuery[it] = '';
				});
			} else {
				overrideQuery[field] = '';
			}
			await replaceQuery(overrideQuery);
			emit('search', keywords.value);
		};

		const filterManager: FilterManager = reactive({
			addField,
			removeField
		});

		provide<FilterManager>(FILTER_KEY, filterManager);

		// 重置筛选项
		const reset = (fields?: FilterModuleField | FilterModuleField[], search = true) => {
			// 单独重置某些筛选项
			if (fields) {
				fields = (Array.isArray(fields) ? fields : [fields]);
				fieldMap.forEach((value, key) => {
					// key可能是数组，比如 rangeDatePicker 类型的筛选项
					if (
						Array.isArray(key)
							? key.some(it => (fields as FilterModuleField[]).includes(it))
							: (fields as FilterModuleField[]).includes(key)
					) {
						const resetFn = value.reset;
						resetFn && resetFn();
					}
				});
			} else {
				fieldMap.forEach((ctx) => {
					const resetFn = ctx.reset;
					resetFn && resetFn();
				});
			}

			search && handleSearch();
		};

		expose({
			reset
		});

		onBeforeUnmount(() => {
			willUnmount = true;
		});

		return {
			reset,
			isExpand,
			showExpand,
			outerModules,
			innerModules,
			getVForKey,
			keywords,
			labelWidth,
			routerReplace,
			handleSearch,
			handleToggle,
			getModelValue,
			onModelValueChange
		};
	},
});

</script>

<style lang="scss">
.vcc-paging-filter {
	&__search-btn {
		margin-left: 24px;
	}

	&__expand-switch {
		margin-left: 12px;
		font-size: 12px;
		color: #333;
		cursor: pointer;
		user-select: none;
	}

	&__expand-modules {
		min-width: 720px;
		margin-top: 20px;
		line-height: 45px;
		background: #f4f4f4;
	}

	&__item {
		display: inline-block;

		&.is-outer {
			&:not(:first-child) {
				margin-left: 24px;
			}
		}
	}
}
</style>
