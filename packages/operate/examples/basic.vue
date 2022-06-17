<template>
	<div style="margin: 100px;">
		<h2>outerCount控制：</h2>
		<vcc-operate
			:data-source="dataSource"
			:outer-count="1"
			@click="handleClick"
		/>
		<div class="demo-block">
			<h2>单行展示：</h2>
			<vcc-operate
				:data-source="dataSource"
				separator="newline"
				@click="handleClick"
			/>
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue';
import { Message } from '@wya/vc';
import VccOperate from '../index.ts';

const dataSource = ref([
	{
		message: '确定要进行该项操作吗？',
		label: '操作项1 - 带确认'
	},
	{
		label: '操作项2'
	},
	{
		message: '确定要进行该项操作吗？',
		label: '操作项3 - 带确认',
		tip: '这是一个既有提示，又有操作确认的操作项'
	}
	// {
	// 	message: '确定要进行该项操作吗？',
	// 	label: '操作项4 - 禁用',
	// 	disabled: true
	// },
	// {
	// 	label: '操作项5 - 带提示',
	// 	tip: '这是一个有提示的操作项'
	// },
	// {
	// 	label: '操作项6 - 禁用',
	// 	disabled: true
	// },
	// {
	// 	label: '操作项7 - 禁用 - 带提示',
	// 	disabled: true,
	// 	tip: '这是一个有提示的、但被禁用的操作项'
	// }
]);
const handleClick = (label, item) => {
	Message.info(label);
};
</script>


<style lang="scss">
.demo-block {
	margin-top: 30px;
}
</style>
