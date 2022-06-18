<template>
	<Table.Column
		label="操作"
		fixed="right"
		align="right"
		:width="width"
	>
		<template #default="{ row, $index }">
			<VccOperate
				:data-source="typeof actions === 'function' ? actions(row, $index) : actions"
				v-bind="operateOptions"
				@ok="$emit('action', $event, row, $index)"
			/>
		</template>
	</Table.Column>
</template>

<script setup lang="ts">
import { Table } from '@wya/vc';
import VccOperate from '@wya/vcc-operate';

defineProps({
	width: {
		type: [Number, String],
		default: 140
	},
	// 可接收一个数组或者一个返回 actions 数组的同步函数
	actions: {
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
