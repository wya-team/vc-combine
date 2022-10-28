<template>
	<div style="padding: 20px;">
		<vcc-paging-filter
			ref="filterRef"
			:modules="modules"
			:outer-count="2"
			history
		/>

		<button @click="handleReset">
			点击重置
		</button>
	</div>
</template>
<script>
import { defineComponent, ref, onMounted } from 'vue';
import Paging from '../index.ts';

export default defineComponent({
	name: "vcc-paging-basic",
	components: {
		'vcc-paging-filter': Paging.Filter,
	},
	setup() {
		const filterRef = ref();
		const dataForSelect = ref([
			{ label: 'before选项一', value: '1' },
			{ label: 'before选项二', value: '2' }
		]);

		const asyncData = ref([]);

		onMounted(() => setTimeout(() => {
			asyncData.value = [
				{ label: '选项一', value: '1' },
				{ label: '选项二', value: '2' }
			];
		}));
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
			{
				type: 'select',
				label: '下拉选择项value：',
				field: 'select',
				dataSource: [
					{ label: '选项一', value: '1' },
					{ label: '选项二', value: '2' }
				]
			},
			{
				type: 'select',
				label: '下拉选择项ref：',
				field: 'select',
				dataSource: asyncData
			},
			{
				type: 'multipleSelect',
				label: '多选下拉选择项：',
				field: 'multipleSelect',
				options: {
					max: 2
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
				},
				hooks: {
					change: () => {
						dataForSelect.value = [
							{ label: 'dataSource返回ref的下拉选项一', value: '1' },
							{ label: 'dataSource返回ref的下拉选项二', value: '2' }
						];
					}
				}
			},
			{
				type: 'select',
				label: 'dataSource返回ref的下拉选择项：',
				field: 'refSelect',
				// 如果返回值为 ref ，请使用 function 返回该 ref 值
				// props中直接传递ref值会被解包，就不是个ref了
				dataSource: () => dataForSelect
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
				field: ['rangeDatePicker_start', 'rangeDatePicker_end'],
				// field: 'rangeDatePicker',
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
				gap: 10,
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

		const handleReset = () => {
			filterRef.value.reset();
		};
		// setTimeout(() => {
		// 	modules.value[0].show = false;
		// }, 2000);

		return {
			filterRef,
			modules,
			handleReset
		};
	}
});
</script>
