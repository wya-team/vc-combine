<template>
	<vc-modal
		v-model="visible"
		title="调整分组"
		size="small"
		@ok="handleOk"
	>
		移动至：
		<vc-select v-model="targetId" style="width: 360px;">
			<vc-option
				v-for="item in categories"
				:key="item[valueKey.catId]"
				:value="item[valueKey.catId]"
			>
				{{ item[valueKey.catName] }}
			</vc-option>
		</vc-select>
	</vc-modal>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import {
	Modal as VcModal,
	Select as VcSelect,
	Option as VcOption
} from '@wya/vc';
import { useConfig } from '../hooks/use-config';

const props = defineProps({
	// 当前所在分组
	value: Number,
	api: {
		type: String,
		default: ''
	},
	http: Function,
	valueKey: Object,
	// 可选的分组
	categories: Array,
	// 选中的文件id数组
	fileIds: Array
});

const emit = defineEmits(['portal-fulfilled']);

const {
	http,
	valueKey
} = useConfig();

const visible = ref(false);
const targetId = ref(props.value);

const handleOk = async () => {
	const { catId, fileId } = valueKey;
	if (targetId.value === props.value) {
		return Promise.resolve();
	}
	await http({
		url: props.api,
		type: 'POST',
		param: {
			[catId]: targetId.value,
			[fileId]: props.fileIds.join()
		}
	});

	emit('portal-fulfilled');
};

onMounted(() => {
	visible.value = true;
});

</script>

<style lang="scss">

</style>
