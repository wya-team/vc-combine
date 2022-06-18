<template>
	<VccPaging
		:load-data="loadData"
		:history="true"
		:router="true"
		:footer="true"
	>
		<Table.Column
			prop="xxx"
			label="名称"
			min-width="120"
		/>

		<VccActionsColumn
			width="200"
			:actions="getActions"
			@action="handleAction"
		/>
	</VccPaging>
</template>

<script setup lang="ts">
import { Table } from '@wya/vc';
import VccPaging from '@wya/vcc-paging';
import { VccActionsColumn } from '../index';

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
