<template>
	<vcc-paging
		:load-data="loadData"
		:history="true"
		:router="true"
		:footer="true"
	>
		<vc-table-column
			prop="xxx"
			label="名称"
			min-width="120"
		/>

		<vcc-table-actions-column
			width="200"
			:data-source="getActions"
			@action="handleAction"
		/>
	</vcc-paging>
</template>

<script setup lang="ts">
import { Table } from '@wya/vc';
import VccPaging from '@wya/vcc-paging';
import VccTable from '../index';

const VcTableColumn = Table.Column;
const VccTableActionsColumn = VccTable.ActionsColumn;

// const actions = [
// 	{ label: '操作一' },
// 	{ label: '操作二' },
// 	{ label: '操作三' }
// ];
const getActions = (row: { status: number }) => {
	return [
		{ label: '操作一' },
		{ label: '操作二' },
		{ label: '操作三', show: row.status === 1 }
	];
};
const handleAction = (label: string, row: object, rowIndex: number) => {
	console.log(label, row, rowIndex);
};

const loadData = async () => {
	return {
		status: 1,
		data: {
			list: [{ status: 1 }, { status: 2 }],
			page: {
				current: 1,
				count: 2,
				total: 1
			}
		}
	};
};

</script>

<style lang="scss">
</style>
