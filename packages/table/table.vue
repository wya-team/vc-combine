<template>
	<vc-radio-group v-model="select">
		<vc-table 
			ref="table"
			:data-source="dataSource"
			v-bind="tableOptions"
			@row-click="handleClickRow"
			@selection-change="handleSelectChange"
		>
			<vc-table-item>
				<vc-table-column
					v-if="multiple && showSelect"
					type="selection"
					width="80"
					:selectable="()=>{
						return selectable(row)
					}"
				/>
				<vc-table-column v-else-if="!multiple && showSelect" width="80">
					<template #default="{ row }">
						<vc-radio :disabled="!selectable(row)" :label="row[name]">
							{{ row.null }}
						</vc-radio>
					</template>
				</vc-table-column>
				<slot />
			</vc-table-item>
			<template #extra>
				<div v-if="!noSelect">
					已选择 {{ selectDetail.length }} 条
				</div>
			</template>
		</vc-table>
	</vc-radio-group>
</template>
<script>
import { computed, defineComponent, ref, onMounted } from "vue";
import { Table, Radio, VcInstance, Message } from "@wya/vc";

export default defineComponent({
	name: 'vcc-table',
	components: {
		'vc-table': Table,
		'vc-table-item': Table.Item,
		'vc-table-column': Table.Column,
		'vc-radio-group': Radio.Group,
		'vc-radio': Radio,
	},
	props: {
		showSelect: { // 是否显示选择框
			type: Boolean,
			default: false
		},
		dataSource: Array,
		multiple: {
			type: Boolean,
			default: true
		},
		max: { // 可选择数量
			type: [String, Number],
			default: 'infinite'
		},
		tableOptions: {
			type: Object,
			default: () => (VcInstance.config?.Paging?.tableOptions || {})
		},
		name: { // 参数名称
			type: String,
			default: ''
		},
		selected: { // 已选择的数据
			type: Array,
			default: () => ([])
		},
		selectable: { // 当前行是否可以选择
			type: Function,
			default: (row) => {
				return true;
			}
		}
		
	},
	emits: ['select'],
	setup(props, { emit }) {
		const select = ref(''); // 单选的选中值
		const selectDetail = ref(props.selected);
		const table = ref();
		const selectedIds = computed(() => { // 获得已选中的属性值数组
			return selectDetail.value.map(it => it[props.name] * 1) || [];
		});
		onMounted(() => {
			if (!props.multiple) {
				select.value = typeof selectDetail.value[0] === 'object' ? selectDetail.value[0][props.name] : selectDetail.value[0];
			}
		});
		/** 
		 * @param {object} row
		 * 点击整行
		 */
		const handleClickRow = (row) => {
			if (props.multiple) {
				const { [props.name]: unique } = row;
				const hasSelect = selectedIds.value.includes(unique);
				if (props.max === selectedIds.value.length && !hasSelect) {
					Message.warning(`最多只能选择${props.max}个`);
					return;
				}
				hasSelect
					? selectDetail.value.splice(selectedIds.value.indexOf(unique), 1)
					: selectDetail.value.push(row);
				table.value.toggleRowSelection(row, !hasSelect);
			} else {
				select.value = row[props.name];
				selectDetail.value = [row];
			}
			emit('select', selectDetail.value);
		};
		const handleSelectChange = (selection) => {
			if (typeof props.max === 'number' && selection.length > props.max) {
				selectDetail.value = selection.splice(1, props.max);
			} else {
				selectDetail.value = selection;
			}
			emit('select', selectDetail.value);
		};
		return {
			select,
			table,
			selectDetail,
			handleClickRow,
			handleSelectChange
		};
	}
});
</script>
