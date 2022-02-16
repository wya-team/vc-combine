<template>
	<vcc-paging
		ref="paging"
		:page-options="pageOptions"
		:table-options="tableOptions"
		:load-data="loadData"
		:history="true"
		:show="show"
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
import { ref, reactive, defineComponent } from 'vue';
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
		const show = ref(true);
		const paging = ref(null);
		const pageOptions = ref();
		const tableOptions = reactive({
			defaultSort: {
				prop: 'date',
				order: 'descending'
			}
		});

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

				return res;
			} catch (e) {
				// throw e;
				console.log(e);
			}
		};

		const handleSortChange = (e) => {
			paging.value.reset(1);
		};

		return {
			show,
			paging,
			pageOptions,
			tableOptions,
			loadData,
			handleSortChange
		};
	}
});
</script>
