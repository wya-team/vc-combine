<template>
	<div class="vcc-paging-filter">
		<div v-if="outerModules.length">
			<component 
				:is="getComponentName(item.type)"
				v-for="item in outerModules"
				:key="item.field"
				:model-value="getModelValue(item)"
				v-bind="item"
				:width="240"
				class="vcc-paging-filter__item is-outer"
				@update:model-value="handleModelValueChange(item, $event)"
				@search="handleSearch"
			>
				<!-- 下拉组合筛选项 存在该插槽 -->
				<component 
					:is="getComponentName(item.children[1].type)"
					v-if="item.type === 'selectCombo'"
					:model-value="getModelValue(item.children[1])"
					v-bind="item.children[1]"
					@update:model-value="handleModelValueChange(item.children[1], $event)"
					@search="handleSearch"
				/>
			</component>
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
				<template v-for="item in innerModules" :key="item.field">
					<!-- 数值范围筛选项 type === 'range' -->
					<component 
						:is="getComponentName(item.type)"
						v-if="item.type === 'range'"
						v-model:start-value="keywords[item.children[0].field]"
						v-model:end-value="keywords[item.children[1].field]"
						v-bind="item"
						class="vcc-paging-filter__item"
						@search="handleSearch"
					/>

					<!-- 下拉组合筛选项 type === 'selectCombo' -->
					<component 
						:is="getComponentName(item.type)"
						v-else-if="item.type === 'selectCombo'"
						v-model:select-value="keywords[item.children[0].field]"
						v-model:combo-value="keywords[item.children[1].field]"
						v-bind="item"
						class="vcc-paging-filter__item"
						@search="handleSearch"
					>
						<component 
							:is="getComponentName(item.children[1].type)"
							:model-value="getModelValue(item.children[1])"
							v-bind="item.children[1]"
							@update:model-value="handleModelValueChange(item.children[1], $event)"
							@search="handleSearch"
						/>
					</component>

					<!-- 其它筛选项 -->
					<component 
						:is="getComponentName(item.type)"
						v-else
						:model-value="getModelValue(item)"
						v-bind="item"
						class="vcc-paging-filter__item"
						@update:model-value="handleModelValueChange(item, $event)"
						@search="handleSearch"
					/>
				</template>
			</div>
		</vc-expand>
	</div>
</template>

<script>
import { ref, computed, getCurrentInstance } from 'vue';
import { Button, Expand, Icon } from '@wya/vc';
import { URL } from '@wya/utils';
import { debounce } from 'lodash';
import {
	Input,
	Select,
	Cascader,
	Range,
	SelectCombo,
	SingleDatePicker,
	RangeDatePicker
} from './modules';
import { useModules } from './hooks';

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
		[getComponentName('range')]: Range,
		[getComponentName('selectCombo')]: SelectCombo,
		[getComponentName('datePicker')]: SingleDatePicker,
		[getComponentName('rangeDatePicker')]: RangeDatePicker,
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
	setup(props, { emit }) {
		const vm = getCurrentInstance();

		const outerModules = computed(() => props.modules.slice(0, props.outerCount));
		const innerModules = computed(() => props.modules.slice(props.outerCount));
		const showExpand = computed(() => props.modules.length > 1);

		let isExpand = ref(false);
		// let labelWidth = ref(0);

		const {
			keywords,
			getModelValue,
			handleModelValueChange
		} = useModules(props);

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
					...keywords,
				};
				await routerReplace(URL.merge({
					path: route.path.join('/'), 
					query
				}));
			}
			
			emit('search', keywords);
		}, 300);

		const handleToggle = () => {
			isExpand.value = !isExpand.value;
		};

		return {
			isExpand, 
			showExpand,
			outerModules,
			innerModules,
			keywords,
			routerReplace,
			handleSearch,
			handleToggle,
			getComponentName,
			getModelValue,
			handleModelValueChange
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
