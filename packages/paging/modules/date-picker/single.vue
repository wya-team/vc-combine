<template>
	<div>
		<span 
			v-if="label" 
			:style="{ width: labelWidth }"
			class="vcc-paging-filter-item-label"
		>
			{{ label }}：
		</span>
		<vc-date-picker
			:model-value="modelValue"
			:style="`width: ${width}px`" 
			type="datetime"
			format="YYYY-MM-DD HH:mm:ss"
			placement="bottom-left"
			confirm
			clearable
			v-bind="options"
			@clear="handleSearch"
			@change="handleChange"
			@ok="handleSearch"
		/>
	</div>
</template>

<script>
import { DatePicker } from '@wya/vc';
import { commonProps } from '../use-common';

export default {
	name: 'vcc-paging-filter-date-picker-single',
	components: {
		'vc-date-picker': DatePicker
	},
	props: {
		...commonProps,
		modelValue: {
			type: [Date, String],
			default: ''
		},
	},
	emits: ['update:modelValue', 'search'],
	setup(props, { emit }) {
		const handleSearch = () => {
			emit('search');
		};
		const handleChange = (value) => {
			emit('update:modelValue', value);
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
