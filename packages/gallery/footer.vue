<template>
	<div class="vca-gallery-footer">
		<div class="vca-gallery-footer__selected-tip">
			已选择{{ selectedFiles.length }}个
			<template v-if="max">
				，最多可选择{{ max }}个
			</template>
		</div>
		<div class="vca-gallery-footer__btn-wrapper">
			<div class="vca-gallery-footer__btn-group">
				<vc-button 
					class="vca-gallery-footer__btn-cancel" 
					@click="$emit('cancel')"
				>
					取消
				</vc-button>
				<vc-button type="primary" @click="$emit('ok')">
					确定
				</vc-button>
			</div>

			<div v-show="selectedFiles.length" class="vca-gallery-footer__btn-group">
				<vc-button @click="handleClearSelected">
					取消选中
				</vc-button>
				<vc-popconfirm title="确定要删除所选文件吗？" @ok="handleDel">
					<vc-button>删除</vc-button>
				</vc-popconfirm>
				<vc-button @click="$emit('move')">
					移动到
				</vc-button>
			</div>
		</div>
	</div>
</template>

<script setup>
import { computed } from 'vue';
import { Button as VcButton, Popconfirm as VcPopconfirm } from '@wya/vc';
import { useConfig } from './hooks';

const {
	apis,
	http,
	valueKey
} = useConfig();

const props = defineProps({
	selectedFiles: {
		type: Array,
		default: () => []
	},
	max: {
		type: Number,
		default: 0
	},
	activeCategory: {
		type: Object,
		default: null
	}
});

const emit = defineEmits([
	'update:selectedFiles',
	'cancel',
	'ok',
	'move',
	'refresh-categories',
	'refresh-files'
]);

const handleClearSelected = () => {
	emit('update:selectedFiles', []);
};
const handleDel = async () => {
	const { fileId } = valueKey;
	const fileIds = props.selectedFiles.map(it => it[fileId]);
	await http({
		url: apis['URL_GALLERY_FILE_DELETE'],
		type: 'POST',
		param: {
			[fileId]: fileIds.join()
		}
	});

	emit('refresh-categories');
	emit('refresh-files');
	handleClearSelected();
};
</script>

<style lang="scss">

.vca-gallery-footer {
	display: flex;
	align-items: center;

	&__selected-tip {
		width: 230px;
		text-align: left;
	}

	&__btn-wrapper {
		display: flex;
		flex-direction: row-reverse;
		justify-content: space-between;
		flex: 1;
	}

	&__btn-cancel {
		margin-right: 8px;
	}
}
</style>
