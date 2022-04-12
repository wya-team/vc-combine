<template>
	<vcc-paging
		ref="paging"
		v-model="checked"
		:page-options="pageOptions"
		:table-options="tableOptions"
		:filter-options="filterOptions"
		:load-data="loadData"
		:disabled="disabled"
		:history="true"
		:footer="true"
		:single="false"
		:selectable="true"
		:max="10"
		row-key="id"
		allow-selection-keep
		@sort-change="handleSortChange"
	>
		<vc-table-item>
			<vc-table-column
				prop="date"
				label="日期"
				width="180"
				sortable
			/>
			<vc-table-column
				prop="name"
				label="姓名"
				width="180"
			/>
			<vc-table-column
				prop="address"
				label="地址"
			/>
		</vc-table-item>
	</vcc-paging>
</template>
<script>
import { watch, ref, reactive, defineComponent, onMounted } from 'vue';
import { ajax } from '@wya/http';
import { Table } from '@wya/vc';
import Paging from '../index.ts';

const getFakeData = (page, pageSize) => {
	let fakeData = [];
	for (let i = 0; i < pageSize; i++) {
		fakeData.push({
			id: `${page}_${i}`,
			name: page + '-Business' + Math.floor(Math.random() * 100 + 1),
			status: Math.floor(Math.random() * 3 + 1),
			opt: Math.floor(Math.random() * 3 + 1),
			date: '2016-05-02',
			address: '上海市普陀区金沙江路 1518 弄'
		});
	}
	return fakeData;
};

export default defineComponent({
	name: "vcc-paging-basic",
	components: {
		'vcc-paging': Paging,
		'vc-table-item': Table.Item,
		'vc-table-column': Table.Column,
	},

	setup() {
		const disabled = ref(false);
		const paging = ref(null);
		const pageOptions = ref();
		const tableOptions = reactive({
			
		});
		const checked = ref([{ id: '1_0' }]); // ['1_0']
		const filterOptions = reactive({
			outerCount: 2,
			modules: [
				{
					type: 'select',
					label: '下拉选择项',
					field: 'mainSelect',
					dataSource: [
						{ label: '选项一', value: 1 },
						{ label: '选项二', value: 2 }
					],
					options: {
						onChange: (v) => {
							filterOptions.modules[1].show = !!v;
						}
					}
				},
				{
					type: 'select',
					label: '下拉选择项',
					field: 'relativeSelect',
					show: false,
					dataSource: [
						{ label: '选项一', value: 1 },
						{ label: '选项二', value: 2 }
					]
				},
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
				}
			]
		});
		const modules = ref([
			{
				type: 'select',
				label: '下拉选择项',
				field: 'mainSelect',
				dataSource: [
					{ label: '选项一', value: 1 },
					{ label: '选项二', value: 2 }
				],
				options: {
					onChange: (v) => {
						modules.value[1].show = !!v;
					}
				}
			},
			{
				type: 'select',
				label: '下拉选择项',
				field: 'relativeSelect',
				show: false,
				dataSource: [
					{ label: '选项一', value: 1 },
					{ label: '选项二', value: 2 }
				]
			},
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
			}
		]);

		const loadData = async ($page, pageSize) => {
			try {
				const res = await ajax({
					url: 'test.json',
					localData: {
						status: 1,
						data: {
							page: {
								current: $page,
								total: 100,
								count: pageSize * 100,
							},
							list: getFakeData($page, pageSize)
						}

					}
				});
				console.log(`page: ${$page}@success`);

				console.log(res);
				return res;
			} catch (e) {
				// throw e;
				console.log(e);
			}
		};

		const handleSortChange = (e) => {
			// 内部已经处理
			// paging.value.reset(1);
		};

		watch(
			() => checked.value,
			(v) => {
				console.log(v);
			}
		);

		onMounted(() => {
			setTimeout(() => {
				console.log(paging.value.getData());
				console.log(paging.value.getData(true));
			}, 2000);
		});

		return {
			checked,
			disabled,
			paging,
			modules,
			pageOptions,
			tableOptions,
			filterOptions,
			loadData,
			handleSortChange
		};
	}
});
</script>
