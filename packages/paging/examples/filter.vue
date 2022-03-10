<template>
	<div style="padding: 20px;">
		<vcc-paging-filter :modules="modules" :outer-count="2" history />
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
				label: '关键词：',
				field: 'input',
				// 将会绑定在vc-input组件上的属性
				options: {
					placeholder: '请输入关键词进行搜索',
				}
			},
			// {
			// 	type: 'select',
			// 	label: '下拉选择项：',
			// 	field: 'select',
			// 	dataSource: [
			// 		{ label: '选项一', value: '1' },
			// 		{ label: '选项二', value: '2' }
			// 	]
			// },
			{
				type: 'select',
				label: '搜索型下拉选择项：',
				field: 'searchableSelect',
				options: {
					searchable: true
				},
				dataSource: () => {
					return new Promise((resolve) => {
						// 模拟异步获取
						setTimeout(() => {
							resolve([
								{ label: '选项一', value: '1' },
								{ label: '选项二', value: '2' }
							]);
						}, 1000);
					});
				}
			},
			{
				type: 'cascader',
				label: '级联选择：',
				field: 'cascader',
				dataSource: [
					{ label: '选项一', value: '1' },
					{ label: '选项二', value: '2' },
					{ 
						label: '选项三',
						value: 3,
						children: [
							{ label: '选项三 - 1', value: '31' },
							{ label: '选项三 - 2', value: '32' }    
						]
					}
				]
			},
			{
				type: 'cascader',
				label: '异步级联选择：',
				field: 'asyncCascader',
				dataSource: () => {
					return new Promise((resolve) => {
						// 模拟异步获取
						setTimeout(() => {
							resolve([
								{ label: '选项一', value: '1' },
								{ label: '选项二', value: '2' },
								{ 
									label: '选项三',
									value: 3,
									children: [
										{ label: '选项三 - 1', value: '31' },
										{ label: '选项三 - 2', value: '32' }    
									]
								}
							]);
						}, 1000);
					});
				}
			},
			{
				type: 'datePicker',
				label: '时间/日期选择：',
				field: 'datePicker',
				// 将会绑定在vc-date-picker组件上的属性
				// options: {
				// 	format: 'YYYY-MM-DD HH:mm:ss'
				// }
			},
			{
				type: 'rangeDatePicker',
				label: '时间/日期范围选择：',
				// field: ['rangeDatePicker_start', 'rangeDatePicker_end'],
				field: 'rangeDatePicker',
				// 将会绑定在vc-date-picker组件上的属性
				options: {
					format: 'YYYY-MM-DD HH:mm:ss'
				}
			},
			{
				type: 'range',
				label: '整数/小数范围：',
				children: [
					{
						field: 'rangeStart',
						// 将会绑定在vc-input-number组件上的属性
						options: {
							// precision: 2,
							max: 100,
						}
					},
					{
						field: 'rangeEnd',
						options: {
							max: 100,
						}
					}
				]
			},
			{
				type: 'selectCombo',
				children: [
					{
						field: 'selectComboType',
						defaultValue: '1',
						dataSource: [
							{ label: '选项一', value: '1' },
							{ label: '选项二', value: '2' }
						],
						style: 'margin-left:24px',
						// 将会绑定在vc-select组件上的属性
						// options: {}
					},
					{
						type: 'range',
						children: [
							{
								field: 'combo_rangeStart',
								// 将会绑定在vc-input-number组件上的属性
								options: {
									max: 100,
								}
							},
							{
								field: 'combo_rangeEnd',
								options: {
									max: 100,
								}
							}
						]
					}
					// {
					// 	type: 'rangeDatePicker',
					// 	field: 'selectComboFilter',
					// }
				]
			}
		]);
		
		return {
			modules
		};
	}
});
</script>
