<template>
	<div class="vcc-paging-filter-input">
		<span v-if="label">{{ label }}：</span>
		<vc-input
			:model-value="modelValue"
			:placeholder="placeholder"
			:style="{ width: width + 'px' }"
			:clearable="clearable"
			@enter="handleSearch"
			@change="handleChange"
		/>
	</div>
</template>

<script>
import { Input } from '@wya/vc';
import { commonProps } from './filter';

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
			console.log(e);
			const value = e.target.value;
			console.log(value);
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
