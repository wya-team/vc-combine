<template>
	<div>
		<span 
			v-if="label" 
			:style="{ width: labelWidth }"
			class="vcc-paging-filter-item-label"
		>
			{{ label }}：
		</span>
		<vc-select
			:model-value="modelValue"
			:style="`width: ${width}px`" 
			clearable
			v-bind="options"
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
import { commonProps } from './use-common';

export default {
	name: 'vcc-paging-filter-select',
	components: {
		'vc-select': Select,
		'vc-option': Option
	},
	props: {
		...commonProps,
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
