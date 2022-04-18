<template>
	<div class="vcc-paging-filter">
		<div v-if="outerModules.length">
			<vcc-paging-filter-item
				v-for="item in outerModules"
				:key="'' + item.field"
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
					:key="item.field"
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

<script>
import { ref, reactive, computed, getCurrentInstance, provide, onBeforeUnmount } from 'vue';
import { Button, Expand, Icon } from '@wya/vc';
import { URL } from '@wya/utils';
import { debounce } from 'lodash';
import { useModules } from './hooks';
import FilterItem from './filter-item.vue';
import { FILTER_KEY } from './constants';

export default {
	name: 'vcc-paging-filter',
	components: {
		'vc-button': Button,
		'vc-expand': Expand,
		'vc-icon': Icon,
		'vcc-paging-filter-item': FilterItem
	},
	props: {
		modules: {
			type: Array,
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
		const vm = getCurrentInstance();
		const fieldMap = new Map();

		// module项可通过‘show'字段控制是否展示，show=true或者不设置show字段则展示
		const enableModules = computed(() => props.modules.filter(it => it.show !== false));

		const outerModules = computed(() => enableModules.value.slice(0, props.outerCount));
		const innerModules = computed(() => enableModules.value.slice(props.outerCount));
		const showExpand = computed(() => enableModules.value.length > props.outerCount);

		let isExpand = ref(false);

		const {
			keywords,
			labelWidth,
			getModelValue,
			onModelValueChange
		} = useModules(props, enableModules);

		const routerReplace = async (fullPath) => {
			const { globalProperties } = vm.appContext.config;
			if (globalProperties.$router && props.router) {
				await globalProperties.$router.replace(fullPath);
			} else {
				window.history.replaceState(null, null, fullPath);
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

		const addField = (field, fieldCtx) => {
			field && fieldCtx && fieldMap.set(field, fieldCtx);
		};

		const removeField = async (field) => {
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

		const filterManager = reactive({
			addField,
			removeField
		});

		provide(FILTER_KEY, filterManager);

		// 重置筛选项
		const reset = (field, search = true) => {
			// 单独重置某些筛选项
			if (field) {
				field = Array.isArray(field) ? field : [field];
				fieldMap.forEach((value, key) => {
					// key可能是数组，比如 rangeDatePicker 类型的筛选项
					if (Array.isArray(key) ? key.some(it => field.includes(it)) : field.includes(key)) {
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
			keywords,
			labelWidth,
			routerReplace,
			handleSearch,
			handleToggle,
			getModelValue,
			onModelValueChange
		};
	},
};

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
