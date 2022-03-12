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
import { ref, reactive, computed, getCurrentInstance, provide } from 'vue';
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

		const handleSearch = debounce(async () => {
			if (props.history) {
				const route = URL.parse();
				let query = {
					...route.query,
					...keywords.value,
				};
				await routerReplace(URL.merge({
					path: route.path.join('/'), 
					query
				}));
			}
			
			emit('search', keywords.value);
		}, 300);

		const handleToggle = () => {
			isExpand.value = !isExpand.value;
		};

		const addField = (field, fieldCtx) => {
			field && fieldCtx && fieldMap.set(field, fieldCtx);
		};

		const removeField = (field) => {
			fieldMap.delete(field);
		};

		const filterManager = reactive({
			addField,
			removeField
		});

		provide(FILTER_KEY, filterManager);

		const reset = (search = true) => {
			fieldMap.forEach((ctx) => {
				const resetFn = ctx.reset;
				resetFn && resetFn();
			});
			search && handleSearch();
		};

		expose({
			reset
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
