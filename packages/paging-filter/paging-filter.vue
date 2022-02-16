<template>
	<div class="vcc-paging-filter">
		<div v-if="firstFilter">
			<component 
				:is="getComponentName(firstFilter.type)"
				v-model="keywords[firstFilter.field]"
				v-bind="firstFilter"
				:width="240"
				class="vcc-paging-filter__item"
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
			<div class="vcc-paging-filter__expand-filters">
				<component 
					:is="getComponentName(item.type)"
					v-for="item in toExpandFilters"
					:key="item.field"
					v-model="keywords[item.field]"
					v-bind="item"
					:width="220"
					class="vcc-paging-filter__item"
				/>
			</div>
		</vc-expand>
	</div>
</template>

<script>
import { ref, reactive, computed, watch, getCurrentInstance } from 'vue';
import { Button, Expand, Icon } from '@wya/vc';
import { URL } from '@wya/utils';
import { debounce } from 'lodash';
import {
	Input,
	Select,
	Cascader
} from './filters';

const COMPONENT_PREFIX = 'vcc-paging-filter';

const getComponentName = type => `${COMPONENT_PREFIX}-${type}`;

export default {
	name: 'vcc-paging-filter',
	components: {
		'vc-button': Button,
		'vc-expand': Expand,
		'vc-icon': Icon,
		[getComponentName('input')]: Input,
		[getComponentName('select')]: Select,
		[getComponentName('cascader')]: Cascader,
	},
	props: {
		filters: {
			type: Array,
			default: () => []
		}
	},
	emits: ['search'],
	setup(props) {
		const vm = getCurrentInstance();

		const firstFilter = computed(() => props.filters[0]);
		const toExpandFilters = computed(() => props.filters.slice(1));
		const showExpand = computed(() => props.filters.length > 1);

		let isExpand = ref(false);
		// let labelWidth = ref(0);
		let keywords;

		const makeKeywords = () => {
			const map = {};
			const { query } = URL.parse();
			let field;
			props.filters.forEach(it => {
				field = it.field;
				map[field] = String(query[field] || '');
			});
			keywords = reactive(map);
		};

		const routerReplace = (fullPath) => {
			const { $router: router } = vm.appContext.config.globalProperties;
			router
				? router.replace(fullPath)
				: window.history.replaceState(null, null, fullPath);
		};

		const handleSearch = debounce(() => {
			const route = vm.appContext.config.globalProperties.$route;
			let query = {
				...route.query,
				...keywords,
			};
			routerReplace(URL.merge({
				path: route.path, 
				query
			}));
			emit('search', keywords);
		}, 300);

		const handleToggle = () => {
			isExpand.value = !isExpand.value;
		};

		watch(props.filters, makeKeywords, { immediate: true });
		
		return {
			isExpand, 
			showExpand,
			firstFilter,
			toExpandFilters,
			keywords,
			routerReplace,
			handleSearch,
			handleToggle,
			getComponentName,
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

	&__expand-filters {
		min-width: 720px;
		margin-top: 20px;
		line-height: 45px;
		background: #f4f4f4;
	}

	&__item {
		display: inline-block;
	}
}
</style>
