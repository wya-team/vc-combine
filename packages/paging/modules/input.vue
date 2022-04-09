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
			v-on="hooks"
		/>
	</div>
</template>

<script>
import { onUnmounted } from 'vue';
import { Input } from '@wya/vc';
import { useFilterManager, commonProps } from '../hooks';

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
		const { filterManager } = useFilterManager();
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

		const reset = () => {
			emit('update:modelValue', '');
		};

		filterManager.addField(props.field, { reset });

		onUnmounted(() => {
			filterManager.removeField(props.field);
		});

		return {
			handleSearch,
			handleChange
		};
	},
};
</script>

<style lang="scss">

</style>
