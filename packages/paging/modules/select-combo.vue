<template>
	<div class="vcc-paging-filter-select-combo">
		<span 
			v-if="label" 
			:style="{ width: labelWidth }"
			class="vcc-paging-filter-item-label"
		>
			{{ label }}：
		</span>
		<vc-select
			:model-value="selectValue"
			:style="`width: ${selectModule.width || 90}px`" 
			class="vcc-paging-filter-select-combo__select"
			v-bind="selectModule.options"
			@change="$emit('update:selectValue', $event)"
		>
			<vc-option
				v-for="item in selectModule.dataSource"
				:key="item.value"
				:value="item.value"
			>
				{{ item.label }}
			</vc-option>
		</vc-select>
		<div class="vcc-paging-filter-select-combo__combo">
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
	emits: ['update:selectValue', 'update:comboValue', 'search'],
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
		margin-right: -1px;

		.vc-select__input {
			margin-top: -1px;
			border-top-right-radius: 0;
			border-bottom-right-radius: 0;
		}
	}

	&__combo {
		.vc-input,
		.vc-select,
		.vc-date-picker {
			border-bottom-left-radius: 0;
			border-top-left-radius: 0;
		}
	}
}
</style>
