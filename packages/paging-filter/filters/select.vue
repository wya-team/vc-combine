<template>
	<div>
		<span v-if="label">{{ label }}：</span>
		<vc-select
			:model-value="modelValue"
			:clearable="clearable"
			:style="`width: ${width}px`" 
			@clear="handleSearch"
			@change="handleChange"
		>
			<vc-option
				v-for="item in dataSource"
				:key="item.value"
				:value="item.value"
			>
				{{ item.label }}
			</vc-option>
		</vc-select>
	</div>
</template>

<script>
import { Select, Option } from '@wya/vc';
import { commonProps } from './filter';

export default {
	name: 'vcc-paging-filter-select',
	components: {
		'vc-select': Select,
		'vc-option': Option
	},
	props: {
		...commonProps,
		placeholder: {
			type: String,
			default: '请选择'
		},
		modelValue: [Number, String],
		dataSource: {
			type: [Array, Function],
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
