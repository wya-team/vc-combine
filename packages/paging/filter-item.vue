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
		@update:start-value="onModelValueChange(module.children[0], $event)"
		@update:end-value="onModelValueChange(module.children[1], $event)"
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
		@update:select-value="onModelValueChange(module.children[0], $event)"
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
		@update:model-value="onModelValueChange(module, $event)"
		@search="handleSearch"
	/>
</template>

<script>
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

const getComponentName = type => `${COMPONENT_PREFIX}-${type}`;
export default {
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
			type: Object,
			default: () => ({})
		},
		getModelValue: Function,
		onModelValueChange: Function,
		labelWidth: String
	},
	emits: ['search'],

	setup(props, { emit }) {
		const handleSearch = () => {
			emit('search');
		};
		return {
			getComponentName,
			handleSearch
		};
	}
};
</script>

<style lang="scss">
.vcc-paging-filter-item-label {
	display: inline-block;
	text-align: right;
}
</style>
