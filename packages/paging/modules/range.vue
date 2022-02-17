<template>
	<div class="vcc-paging-filter-range">
		<span v-if="label">{{ label }}：</span>
		<vc-input-number
			:model-value="startValue"
			:max="getEdgeValue('max', start)"
			:min="getEdgeValue('min', start)"
			:step="false"
			:precision="0"
			:clearable="clearable"
			placeholder="" 
			:style="{ width: `${start.width || 64}px` }"
			class="vcc-paging-filter-range__input-start"
			v-bind="start"
			@clear="handleSearch"
			@update:model-value="$emit('update:startValue', $event)"
		/>
		~
		<vc-input-number
			:model-value="endValue"
			:max="getEdgeValue('max', end)"
			:min="getEdgeValue('min', end)"
			:step="false"
			:precision="0"
			:clearable="clearable"
			placeholder="" 
			:style="{ width: `${end.width || 64}px` }"
			class="vcc-paging-filter-range__input-end"
			v-bind="end"
			@clear="handleSearch"
			@update:model-value="$emit('update:endValue', $event)"
		/>
	</div>
</template>

<script>
import { computed } from 'vue';
import { InputNumber } from '@wya/vc';
import { commonProps } from './filter';
import { AMOUNT_MIN, AMOUNT_MAX, INT_MIN, INT_MAX } from '../constants';

export default {
	name: 'vcc-paging-filter-range',
	components: {
		'vc-input-number': InputNumber
	},
	props: {
		...commonProps,
		startValue: {
			type: [Number, String],
			default: ''
		},
		endValue: {
			type: [Number, String],
			default: ''
		},
		children: {
			type: Array,
			default: () => []
		},
	},
	emits: ['update:startValue', 'update:endValue', 'search'],
	setup(props, { emit }) {
		const start = computed(() => props.children[0]);
		const end = computed(() => props.children[1]);

		const handleSearch = () => {
			emit('search');
		};

		const getEdgeValue = (edgeType, userOpts) => {
			return edgeType === 'max' 
				? (userOpts.max || (userOpts.precision && userOpts.precision > 0 ? AMOUNT_MAX : INT_MAX))
				: (userOpts.min || (userOpts.precision && userOpts.precision > 0 ? AMOUNT_MIN : INT_MIN));
				
		};
		
		return {
			AMOUNT_MIN,
			AMOUNT_MAX,
			INT_MIN,
			INT_MAX,
			start,
			end,
			getEdgeValue,
			handleSearch,
		};
	},
};
</script>

<style lang="scss">
.vcc-paging-filter-range {
	display: inline-flex !important;
	align-items: center;

	&__input-start {
		margin-right: 5px;
	}

	&__input-end {
		margin-left: 5px;
	}
}
</style>