<template>
	<div class="vcc-paging-filter-select">
		<span
			v-if="label"
			:style="{ width: labelWidth }"
			class="vcc-paging-filter-item-label"
		>
			{{ label }}
		</span>
		<vc-select
			:model-value="modelValue"
			:style="`width: ${width}px`"
			:load-data="asyncSearch"
			clearable
			v-bind="options"
			@clear="handleSearch"
			@change="handleChange"
			@visible-change="handleVisibleChange"
			v-on="hooks"
		>
			<vc-spin
				v-if="isLoading"
				:size="16"
				class="vcc-paging-filter-select__loading"
			/>
			<vc-option
				v-for="item in optionList"
				:key="item.value"
				:value="item.value"
			>
				{{ item.label }}
			</vc-option>
		</vc-select>
	</div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { onMounted, onUnmounted, defineComponent } from 'vue';
import { Select, Option, Spin } from '@wya/vc';
import { commonProps } from '../hooks/use-filter-common';
import { useDataSource, useFilterManager } from '../hooks';
import type { FieldValue, SelectDataSource } from '../filter-types';

export default defineComponent({
	name: 'vcc-paging-filter-select',
	components: {
		'vc-select': Select,
		'vc-option': Option,
		'vc-spin': Spin
	},
	props: {
		...commonProps,
		modelValue: [Number, String, Array] as PropType<FieldValue | FieldValue[]>,
		dataSource: {
			type: [Array, Function] as PropType<SelectDataSource>,
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
			if (props.type !== 'multipleSelect') {
				handleSearch();
			}
		};

		const {
			isLoading,
			dataSource,
			getDataSource,
			asyncSearch
		} = useDataSource(props.dataSource);

		const handleVisibleChange = () => {
			getDataSource();
		};

		onMounted(() => {
			if (props.modelValue !== '' && props.modelValue !== undefined) {
				getDataSource();
			}
		});

		const reset = () => {
			emit('update:modelValue', props.type === 'multipleSelect' ? [] : '');
		};

		filterManager.addField(props.field, { reset });

		onUnmounted(() => {
			filterManager.removeField(props.field);
		});

		return {
			isLoading,
			optionList: dataSource,
			asyncSearch,
			handleSearch,
			handleChange,
			handleVisibleChange
		};
	},
});
</script>

<style lang="scss">
.vcc-paging-filter-select {
	&__loading {
		display: flex;
		margin: 10px 0;
		justify-content: center;
	}
}
</style>
