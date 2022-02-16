<template>
	<div style="padding: 20px;">
		<vcc-paging-filter :modules="modules" history />
	</div>
</template>
<script>
import { defineComponent, ref } from 'vue'; 
import Paging from '../index.ts';

export default defineComponent({
	name: "vcc-paging-basic",
	components: {
		'vcc-paging-filter': Paging.Filter,
	},
	setup() {
		const modules = ref([
			{
				type: 'input',
				label: '关键词',
				field: 'input',
				placeholder: '请输入关键词进行搜索'
			},
			{
				type: 'select',
				label: '下拉选择项',
				field: 'select',
				dataSource: [
					{ label: '选项一', value: 1 },
					{ label: '选项二', value: 2 }
				]
			},
			{
				type: 'cascader',
				label: '级联选择',
				field: 'cascader',
				dataSource: [
					{ label: '选项一', value: 1 },
					{ label: '选项二', value: 2 },
					{ 
						label: '选项三',
						value: 3,
						children: [
							{ label: '选项三 - 1', value: 31 },
							{ label: '选项三 - 2', value: 32 }    
						]
					}
				]
			},
			{
				type: 'datePicker',
				label: '时间/日期选择',
				field: 'datePicker',
			},
			{
				type: 'rangeDatePicker',
				label: '时间/日期范围选择',
				field: 'rangeDatePicker',
				// vc-date-picker组件配置
				options: {
					format: 'YYYY-MM-DD'
				}
			},
			{
				type: 'range',
				label: '整数/小数范围',
				children: [
					{
						field: 'rangeStart',
						max: 2,
					},
					{
						field: 'rangeEnd',
						max: 2
					}
				]
			}
		]);
		
		return {
			modules
		};
	}
});
</script>
