<template>
	<div class="vcc-paging-filter-range">
		<span
			v-if="label"
			:style="{ width: labelWidth }"
			class="vcc-paging-filter-item-label"
		>
			{{ label }}
		</span>
		<vc-input-number
			:model-value="startValue"
			:max="getEdgeValue('max', start.options)"
			:step="false"
			:precision="0"
			placeholder=""
			output="string"
			:style="{ width: `${start.width || 100}px` }"
			class="vcc-paging-filter-range__input-start"
			clearable
			v-bind="start.options"
			@clear="handleSearch"
			@enter="handleSearch"
			@update:model-value="$emit('update:startValue', $event)"
			v-on="start.hooks || {}"
		/>
		~
		<vc-input-number
			:model-value="endValue"
			:max="getEdgeValue('max', end.options)"
			:step="false"
			:precision="0"
			placeholder=""
			output="string"
			:style="{ width: `${end.width || 100}px` }"
			class="vcc-paging-filter-range__input-end"
			clearable
			v-bind="end.options"
			@clear="handleSearch"
			@enter="handleSearch"
			@update:model-value="$emit('update:endValue', $event)"
			v-on="end.hooks || {}"
		/>
	</div>
</template>

<script lang="ts">
import { computed, onUnmounted, defineComponent, PropType } from 'vue';
import { InputNumber } from '@wya/vc';
import { pick } from 'lodash';
import { commonProps } from '../hooks/use-filter-common';
import { AMOUNT_MIN, AMOUNT_MAX, INT_MIN, INT_MAX } from '../constants';
import { useFilterManager } from '../hooks';
import type { RangeModule } from '../filter-types';

export default defineComponent({
	name: 'vcc-paging-filter-range',
	components: {
		'vc-input-number': InputNumber
	},
	props: {
		...pick(
			commonProps,
			['type', 'label', 'labelWidth']
		) as Pick<typeof commonProps, 'type' | 'label' | 'labelWidth'>,
		startValue: {
			type: [Number, String],
			default: ''
		},
		endValue: {
			type: [Number, String],
			default: ''
		},
		children: {
			type: (Array as unknown) as PropType<RangeModule['children']>,
			default: () => []
		},
	},
	emits: ['update:startValue', 'update:endValue', 'search'],
	setup(props, { emit }) {
		const { filterManager } = useFilterManager();
		const start = computed(() => props.children[0]);
		const end = computed(() => props.children[1]);

		const handleSearch = () => {
			emit('search');
		};

		const getEdgeValue = (edgeType: 'max' | 'min', userOpts: { [key: string]: unknown } = {}) => {
			const precision = userOpts.precision as number;
			return edgeType === 'max'
				? (userOpts.max || (precision && precision > 0 ? AMOUNT_MAX : INT_MAX))
				: (userOpts.min || (precision && precision > 0 ? AMOUNT_MIN : INT_MIN));
		};


		const getResetter = (isStart: boolean) => {
			return isStart
				? () => {
					emit('update:startValue', '');
				} : () => {
					emit('update:endValue', '');
				};
		};

		props.children.forEach((it, index) => {
			filterManager.addField(it.field, {
				reset: getResetter(index === 0)
			});
		});

		onUnmounted(() => {
			props.children.forEach((it) => {
				filterManager.removeField(it.field);
			});
		});

		return {
			start,
			end,
			getEdgeValue,
			handleSearch,
		};
	},
});
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
