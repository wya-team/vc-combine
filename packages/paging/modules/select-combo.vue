<template>
	<div class="vcc-paging-filter-select-combo">
		<span 
			v-if="label" 
			:style="{ width: labelWidth }"
			class="vcc-paging-filter-item-label"
		>
			{{ label }}
		</span>
		<vc-select
			:model-value="selectValue"
			:style="{ width: `${selectModule.width || 90}px`, marginLeft: label ? '' : '24px' }" 
			class="vcc-paging-filter-select-combo__select"
			v-bind="selectModule.options || {}"
			@change="$emit('update:selectValue', $event)"
			v-on="selectModule.hooks || {}"
		>
			<vc-option
				v-for="item in selectModule.dataSource"
				:key="item.value"
				:value="item.value"
			>
				{{ item.label }}
			</vc-option>
		</vc-select>
		<div
			:style="`margin-left:${gap}px`"
			class="vcc-paging-filter-select-combo__combo"
		>
			<slot />
		</div>
	</div>
</template>

<script>
import { computed } from 'vue';
import { Select, Option } from '@wya/vc';

export default {
	name: 'vcc-paging-filter-select-combo',
	components: {
		'vc-select': Select,
		'vc-option': Option
	},
	props: {
		label: String,
		labelWidth: String,
		gap: {
			type: Number,
			default: 3
		},
		selectValue: {
			type: [String, Number],
			default: ''
		},
		comboValue: {
			type: [String, Number],
			default: ''
		},
		children: {
			type: Array,
			default: () => []
		},
	},
	emits: ['update:selectValue', 'search'],
	setup(props, { emit }) {
		const selectModule = computed(() => props.children[0]);

		const handleSearch = () => {
			emit('search');
		};

		return {
			selectModule,

			handleSearch,
		};
	},
};
</script>

<style lang="scss">
.vcc-paging-filter-select-combo {
	display: inline-flex !important;
	align-items: center;

	&__select {
		height: 28px;

		.vc-select__input {
			border-top-right-radius: 0;
			border-bottom-right-radius: 0;
		}
	}

	&__combo {
		height: 28px;
		line-height: 28px;

		.vc-input:first-child,
		.vc-select,
		.vc-date-picker {
			border-bottom-left-radius: 0;
			border-top-left-radius: 0;
		}
	}
}
</style>
