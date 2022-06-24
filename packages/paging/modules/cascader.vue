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
			:data-source="optionList"
			:style="`width: ${width}px`"
			placeholder="请选择"
			change-on-select
			clearable
			v-bind="options"
			@clear="handleSearch"
			@change="handleChange"
			@visible-change="handleVisibleChange"
			v-on="hooks"
		/>
	</div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { onMounted, onUnmounted, defineComponent } from 'vue';
import { Cascader } from '@wya/vc';
import { useDataSource, useFilterManager, commonProps } from '../hooks';
import type { FieldValue, CascaderDataSource } from '../filter-types';

export default defineComponent({
	name: 'vcc-paging-filter-input',
	components: {
		'vc-cascader': Cascader
	},
	props: {
		...commonProps,
		modelValue: {
			type: Array as PropType<FieldValue[]>,
			default: () => []
		},
		dataSource: {
			type: [Array, Function] as PropType<CascaderDataSource>,
			default: () => []
		}
	},
	emits: ['update:modelValue', 'search'],
	setup(props, { emit }) {
		const { filterManager } = useFilterManager();
		const handleSearch = () => {
			emit('search');
		};
		const handleChange = (value) => {
			emit('update:modelValue', value);
			handleSearch();
		};

		const {
			isLoading,
			dataSource,
			getDataSource,
		} = useDataSource(props.dataSource);

		const handleVisibleChange = () => {
			getDataSource();
		};

		onMounted(() => {
			if (props.modelValue && props.modelValue.length) {
				getDataSource();
			}
		});

		const reset = () => {
			emit('update:modelValue', []);
		};

		filterManager.addField(props.field, { reset });

		onUnmounted(() => {
			filterManager.removeField(props.field);
		});

		return {
			isLoading,
			optionList: dataSource,
			handleSearch,
			handleChange,
			handleVisibleChange
		};
	},
});
</script>

<style lang="scss">

</style>
