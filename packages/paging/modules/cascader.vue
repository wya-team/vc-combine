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

<script>
import { onMounted, reactive } from 'vue';
import { Cascader } from '@wya/vc';
import { useDataSource, useFilterManager, commonProps } from '../hooks';

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
			type: [Array, Function],
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
		} = useDataSource(props);

		const handleVisibleChange = () => {
			getDataSource(props.dataSource);
		};

		onMounted(() => {
			if (props.modelValue && props.modelValue.length) {
				getDataSource(props.dataSource);
			}
		});

		const reset = () => {
			emit('update:modelValue', []);
		};

		const fieldCtx = reactive({
			reset
		});

		filterManager.addField(props.field, fieldCtx);
		
		return {
			isLoading,
			optionList: dataSource,
			handleSearch,
			handleChange,
			handleVisibleChange
		};
	},
};
</script>

<style lang="scss">

</style>
