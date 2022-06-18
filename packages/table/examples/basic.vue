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
			:operate-options="{ separator: 'newline' }"
			@action="handleAction"
		/>
	</VccPaging>
</template>

<script setup>
import { Table } from '@wya/vc';
import VccPaging from '@wya/vcc-paging';
import { VccActionsColumn } from '../index.ts';

// const actions = [
// 	{ label: '操作一' },
// 	{ label: '操作二' },
// 	{ label: '操作三' }
// ];
const getActions = (row) => {
	return [
		{ label: '操作一' },
		{ label: '操作二' },
		{ label: '操作三', show: row.a === 1 }
	];
};
const handleAction = (label, row, rowIndex) => {
	console.log(label, row, rowIndex);
};

const loadData = async () => {
	return {
		status: 1,
		data: {
			list: [{}, { a: 1 }],
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
