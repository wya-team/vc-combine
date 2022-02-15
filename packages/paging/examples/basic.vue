<template>
	<vcc-paging
		:data-source="listInfo.data"
		:load-data="loadData"
		:total="listInfo.total"
		:count="listInfo.count"
		:reset="listInfo.reset"
		:page-options="page"
		:table-options="table"
		:history="true"
		:show="show"
		style="width: 100%;"
		@page-size-change="handleResetFirst"
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
		<template #loading>
			<div>loading</div>
		</template>
	</vcc-paging>
</template>
<script>
import { ref, reactive, defineComponent } from 'vue';
import { ajax } from '@wya/http';
import { Table } from '@wya/vc';
import Paging from '../index.ts';

const initPage = () => ({
	reset: false,
	current: 0,
	total: 0,
	count: 0,
	data: {

	}
});

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

		const show = ref(true);
		const listInfo = ref(initPage());
		const page = ref(undefined);
		const table = reactive({
			defaultSort: {
				prop: 'date',
				order: 'descending'
			}
		});

		const loadData = ($page, pageSize) => {
			return new Promise((reslove, reject) => {
				setTimeout(() => {
					reslove();
				}, 3000);
			}).then(() => {
				return ajax({
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
				}).then((res) => {
					console.log(`page: ${$page}@success`);
					listInfo.value = {
						...listInfo.value,
						...res.data.page,
						data: {
							...listInfo.value.data,
							[$page]: res.data.list
						}
					};
				}).catch((e) => {
					console.log(e);
				});
			});
		};

		/**
		 * 回到首页刷新
		 */
		const handleResetFirst = () => {
			listInfo.value = initPage();
		};
		/**
		 * 当前页刷新
		 */
		const handleResetCur = () => {
			listInfo.value = {
				...initPage(),
				reset: true,
			};
		};

		return {
			show,
			listInfo,
			page,
			table,
			loadData,
			handleResetFirst,
			handleResetCur
		};
	}
});
</script>
