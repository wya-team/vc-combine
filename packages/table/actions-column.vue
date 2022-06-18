<template>
	<vc-table-column
		label="操作"
		fixed="right"
		align="right"
		:width="width"
	>
		<template #default="{ row, $index }">
			<vcc-operate
				:data-source="typeof dataSource === 'function' ? dataSource(row, $index) : dataSource"
				v-bind="operateOptions"
				@ok="$emit('action', $event, row, $index)"
			/>
		</template>
	</vc-table-column>
</template>

<script lang="ts">
export default {
	name: 'vcc-table-actions-column'
};
</script>

<script setup lang="ts">
import { Table } from '@wya/vc';
import VccOperate from '@wya/vcc-operate';

const VcTableColumn = Table.Column;

defineProps({
	width: {
		type: [Number, String],
		default: 140
	},
	// 可接收一个数组或者一个返回 dataSource 数组的同步函数
	dataSource: {
		type: [Array, Function],
		default: () => ([])
	},
	operateOptions: {
		type: Object,
		default: () => ({})
	}
});

defineEmits(['action']);
</script>

<style lang="scss">

</style>
