<template>
	<div class="vcc-paging-filter-input">
		<span 
			v-if="label" 
			:style="{ width: labelWidth }"
			class="vcc-paging-filter-item-label"
		>
			{{ label }}
		</span>
		<vc-input
			:model-value="modelValue"
			:style="{ width: width + 'px' }"
			clearable
			v-bind="options"
			@enter="handleSearch"
			@change="handleChange"
		/>
	</div>
</template>

<script>
import { Input } from '@wya/vc';
import { commonProps } from './use-common';

export default {
	name: 'vcc-paging-filter-input',
	components: {
		'vc-input': Input
	},
	props: {
		...commonProps,
		modelValue: String
	},
	emits: ['update:modelValue', 'search'],
	setup(props, { emit }) {
		const handleSearch = () => {
			emit('search');
		};
		const handleChange = (e) => {
			const value = e.target.value;
			emit('update:modelValue', value);
			if (!value) {
				handleSearch();
			}
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
