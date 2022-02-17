<template>
	<div>
		<span 
			v-if="label" 
			:style="{ width: labelWidth }"
			class="vcc-paging-filter-item-label"
		>
			{{ label }}
		</span>
		<vc-cascader
			:model-value="modelValue"
			:data-source="dataSource"
			:style="`width: ${width}px`" 
			placeholder="请选择"
			change-on-select
			clearable
			v-bind="options"
			@clear="handleSearch"
			@change="handleChange"
		/>
	</div>
</template>

<script>
import { Cascader } from '@wya/vc';
import { commonProps } from './use-common';

export default {
	name: 'vcc-paging-filter-input',
	components: {
		'vc-cascader': Cascader
	},
	props: {
		...commonProps,
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
