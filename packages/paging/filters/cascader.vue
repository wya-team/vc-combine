<template>
	<div>
		<span v-if="label">{{ label }}：</span>
		<vc-cascader
			:model-value="modelValue"
			:data-source="dataSource"
			:clearable="clearable"
			:placeholder="placeholder"
			:style="`width: ${width}px`" 
			change-on-select
			@clear="handleSearch"
			@change="handleChange"
		/>
	</div>
</template>

<script>
import { Cascader } from '@wya/vc';
import { commonProps } from './filter';

export default {
	name: 'vcc-paging-filter-input',
	components: {
		'vc-cascader': Cascader
	},
	props: {
		...commonProps,
		placeholder: {
			type: String,
			default: '请选择'
		},
		modelValue: {
			type: Array,
			default: () => []
		},
		dataSource: {
			type: Array,
			default: () => []
		}
	},
	emits: ['update:modelValue', 'search'],
	setup(props, { emit }) {
		const handleSearch = () => {
			emit('search');
		};
		const handleChange = (value) => {
			emit('update:modelValue', value);
			handleSearch();
		};
		
		return {
			handleSearch,
			handleChange
		};
	},
};
</script>

<style lang="scss">

</style>
