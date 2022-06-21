<template>
	<!-- 数值范围筛选项 type === 'range' -->
	<component
		:is="getComponentName('range')"
		v-if="module.type === 'range'"
		:start-value="getModelValue(module.children[0])"
		:end-value="getModelValue(module.children[1])"
		:label-width="labelWidth"
		:class="$attrs.class"
		v-bind="module"
		@search="handleSearch"
		@update:start-value="handleRangeChange(0, module, $event)"
		@update:end-value="handleRangeChange(1, module, $event)"
	/>

	<!-- 下拉组合筛选项 type === 'selectCombo' -->
	<component
		:is="getComponentName('selectCombo')"
		v-else-if="module.type === 'selectCombo'"
		:select-value="getModelValue(module.children[0])"
		:label-width="labelWidth"
		:class="$attrs.class"
		v-bind="module"
		@search="handleSearch"
		@update:select-value="handleSelectComboChange(module, $event)"
	>
		<!-- 通过文件名引用自身组件 -->
		<filter-item
			:module="module.children[1]"
			:get-model-value="getModelValue"
			:on-model-value-change="onModelValueChange"
			:label-width="labelWidth"
			@search="handleSearch"
		/>
	</component>

	<!-- 其它筛选项 -->
	<component
		:is="getComponentName(module.type)"
		v-else
		:model-value="getModelValue(module)"
		:label-width="labelWidth"
		:class="$attrs.class"
		v-bind="module"
		@update:model-value="handleCommonChange(module, $event)"
		@search="handleSearch"
	/>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';
import type {
	Module,
	FieldValue,
	RangeModule,
	SelectComboModule,
	ModuleWithoutChildren
} from './filter-types';
import type {
	GetModelValue,
	OnModelValueChange
} from './hooks/use-modules';
import {
	Input,
	Select,
	Cascader,
	Range,
	SelectCombo,
	SingleDatePicker,
	RangeDatePicker
} from './modules';

const COMPONENT_PREFIX = 'vcc-paging-filter';

const getComponentName = (type: Module['type']) => `${COMPONENT_PREFIX}-${type}`;
export default defineComponent({
	name: 'vcc-paging-filter-item',
	components: {
		[getComponentName('input')]: Input,
		[getComponentName('select')]: Select,
		[getComponentName('multipleSelect')]: Select,
		[getComponentName('cascader')]: Cascader,
		[getComponentName('range')]: Range,
		[getComponentName('selectCombo')]: SelectCombo,
		[getComponentName('datePicker')]: SingleDatePicker,
		[getComponentName('rangeDatePicker')]: RangeDatePicker,
	},
	props: {
		module: {
			type: Object as PropType<Module>,
			default: () => ({})
		},
		getModelValue: {
			type: Function as PropType<GetModelValue>,
			default: () => {}
		},
		onModelValueChange: {
			type: Function as PropType<OnModelValueChange>,
			default: () => {}
		},
		labelWidth: String
	},
	emits: ['search'],

	setup(props, { emit }) {
		const handleSearch = () => {
			emit('search');
		};
		const handleRangeChange = (index: number, module: Module, value: FieldValue) => {
			props.onModelValueChange((module as RangeModule).children[index], value);
		};
		const handleSelectComboChange = (module: Module, value: FieldValue) => {
			props.onModelValueChange((module as SelectComboModule).children[0], value);
		};
		const handleCommonChange = (module: Module, value: FieldValue | FieldValue[]) => {
			props.onModelValueChange(module as ModuleWithoutChildren, value);
		};
		return {
			getComponentName,
			handleRangeChange,
			handleSelectComboChange,
			handleCommonChange,
			handleSearch
		};
	}
});
</script>

<style lang="scss">
.vcc-paging-filter-item-label {
	display: inline-block;
	text-align: right;
}
</style>
