<template>
	<div>
		<span
			v-if="label"
			:style="{ width: labelWidth }"
			class="vcc-paging-filter-item-label"
		>
			{{ label }}
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
			v-on="hooks"
		/>
	</div>
</template>

<script lang="ts">
import { onUnmounted, defineComponent } from 'vue';
import { DatePicker } from '@wya/vc';
import { useFilterManager, commonProps } from '../../hooks';

export default defineComponent({
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
		const { filterManager } = useFilterManager();

		const handleSearch = () => {
			emit('search');
		};
		const handleChange = (value: string) => {
			emit('update:modelValue', value);
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
});
</script>

<style lang="scss">

</style>
