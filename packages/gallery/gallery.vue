<template>
	<vc-modal
		v-model="isVisible"
		:mask-closable="false"
		size="large"
		:title="`我的${sourceName}`"
		class="vca-gallery vm-hack-editor"
	>
		<div class="vca-gallery__content">
			<div class="vca-gallery__category--wrapper">
				<vca-gallery-category-menu
					:model-value="activeCategoryId"
					:data-source="categories"
					:upload-opts="fileUploadOpts"
					@create="handleCreateCategory"
					@delete="handleDeleteCategory"
					@update:modelValue="handleActiveCategoryChange"
					@upload="handleUpload"
					@rename-category="handleRenameCategory"
				/>
			</div>

			<div class="vca-gallery__view--wrapper">
				<div class="vca-gallery__view">
					<div class="vca-gallery__view-imgs">
						<div 
							v-if="false"
							class="vca-gallery__empty"
						>
							暂无素材，请上传
						</div>
						<vcc-paging
							v-else-if="categories.length >= 1"
							ref="pagingRef"
							:page-options="pageOptions"
							:load-data="loadFiles"
							:history="false"
							mode="piece"
							footer
							@page-size-change="handleRefresh"
						>
							<template #default="{ it }">
								<vca-gallery-file-item
									:it="it"
									:checked="selectedFileIds.includes(it[valueKey.fileId])"
									:disabled="disabledList.includes(it[valueKey.fileUrl])"
									@toggle="handleFileToggle(it)"
								/>
							</template>
						</vcc-paging>
					</div>
				</div>
			</div>
		</div>

		<template #footer>
			<vca-gallery-footer
				:selected-files="selectedFiles"
				:max="max"
				@cancel="handleCancel"
				@ok="handleConfirm"
				@move="handleMoveFile"
				@refresh-categories="loadCategories"
				@refresh-files="handleRefresh"
				@update:selectedFiles="handleSelectedFilesChange"
			/>
		</template>
	</vc-modal>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { Modal as VcModal, Message } from '@wya/vc';
import VccPaging from '@wya/vcc-paging';
import { ajax } from '@wya/http';
import { SOURCE_MAP, DEFAULT_FIELD_MAP } from './constants';
import VcaGalleryCategoryMenu from './menu.vue';
import VcaGalleryFileItem from './file-item.vue';
import VcaGalleryFooter from './footer.vue';
import { useConfig, useCategory, useFile } from './hooks';
import { Uploader, MoveFile } from './popup';

const props = defineProps({
	dataSource: {
		type: Array,
		default: () => []
	},
	// 类型：图片image、视频video、音频audio
	mode: {
		type: String,
		default: 'image',
		validator: value => Object.keys(SOURCE_MAP).includes(value)
	},
	ajax: {
		type: Function,
		default: ajax
	},
	apis: {
		type: Object,
		default: () => ({})
	},
	max: {
		type: Number,
		default: 0
	},
	// 可选的最大视频或音频时长，0表示不限制，单位：s
	maxDuration: {
		type: Number,
		default: 0
	},
	uploadOpts: {
		type: Object,
		default: () => ({
			multiple: true,
			max: 10,
			size: 0,
		})
	},
	disabledList: {
		type: Array,
		default: () => ([])
	},
	valueKey: {
		type: Object,
		default: () => DEFAULT_FIELD_MAP
	},
	// 输出的类型，url，仅输出文件oss的url，original，输出整个文件的信息（Object的形式）
	output: {
		type: String,
		default: 'url',
		validator: value => ['url', 'original'].includes(value)
	}
});

const emit = defineEmits(['portal-fulfilled', 'portal-rejected']);

const {
	setConfig
} = useConfig();

const sourceName = SOURCE_MAP[props.mode].name;
setConfig({
	valueKey: props.valueKey,
	mode: props.mode,
	apis: props.apis,
	http: props.ajax,
	sourceName
});

const isVisible = ref(false);
const pagingRef = ref(null);
const pageOptions = reactive({
	showTotal: true,
	showSizer: true,
	showElevator: true,
	placement: 'top',
	pageSizeOpts: [20, 30, 40, 100]
});

const refreshFiles = (page) => {
	pagingRef.value.reset(page);
};

const {
	categories,
	activeCategoryId,
	loadCategories,
	setActiveCategory,
	createCategory,
	renameCategory: handleRenameCategory,
	deleteCategory: handleDeleteCategory
} = useCategory(
	refreshFiles
);

const handleActiveCategoryChange = setActiveCategory;

const {
	fileUploadOpts,
	selectedFiles,
	selectedFileIds,
	loadFiles: _loadFiles,
	toggleFile: handleFileToggle,
	setSelectedFiles
} = useFile(
	props
);

const handleSelectedFilesChange = setSelectedFiles;

const handleRefresh = () => {
	refreshFiles(1);
};

const loadFiles = (page, pageSize) => {
	return _loadFiles(activeCategoryId.value, page, pageSize);
};

const handleCreateCategory = () => {
	createCategory(loadCategories);
};

const handleUpload = () => {
	Uploader.popup({
		catId: activeCategoryId.value,
		mode: props.mode,
		uploadOpts: fileUploadOpts,
		categories: categories.value,
		valueKey: props.valueKey,
		apis: props.apis,
		http: props.ajax
	}).then(({ catId }) => {
		setActiveCategory(catId);
	});
};

const handleMoveFile = () => {
	MoveFile.popup({
		value: activeCategoryId.value,
		api: props.apis.URL_GALLERY_FILE_MOVE,
		http: props.ajax,
		valueKey: props.valueKey,
		categories: categories.value,
		fileIds: selectedFileIds.value
	}).then(() => {
		loadCategories();
		refreshFiles(1);
		setSelectedFiles([]);
	});
};

const handleCancel = () => {
	isVisible.value = false;
	emit('portal-rejected');
};

const handleConfirm = () => {
	const { fileUrl } = props.valueKey;
	isVisible.value = false;
	const list = props.output === 'original' ? selectedFiles.value : selectedFiles.value.map(it => it[fileUrl]);
	emit('portal-fulfilled', { list });
};

onMounted(() => {
	categories.value = props.dataSource;
	isVisible.value = true;
});

setTimeout(() => {
	setActiveCategory(categories.value[0][props.valueKey.catId]);
});

</script>

<style lang="scss">

$c-border: #e8e8e8;

.vca-gallery {
	font-size: 14px;

	&__content {
		flex: 1;
		display: flex;
	}

	&__category {
		&--wrapper {
			flex-shrink: 0;
			width: 229px;
			border-right: 1px solid $c-border;
		}
	}

	&__view-toolbar {
		display: flex;
		height: 46px;
		padding: 0 24px;
		border-bottom: 1px solid #e8e8e8;
		justify-content: space-between;
		align-items: center;

		.vc-input {
			.vc-btn {
				border-radius: 0 4px 4px 0;
			}
		}
	}

	&__view-imgs {
		position: relative;
		padding: 0 24px;
		overflow: hidden;
	}

	&__view {
		display: flex;
		flex-direction: column;
		height: 100%;

		&--wrapper {
			padding: 0;
			flex: 1;
		}
	}

	&__empty {
		display: flex;
		justify-content: center;
		align-items: center;
		flex: 1;
	}

	.vca-gallery-file-item {
		margin: 5px;
		background: #fff;
	}

	.vcc-paging {
		height: 100%;
	}

	.vcc-paging-core {
		position: relative;
		height: 100%;
		overflow-y: auto;
	}

	.vc-modal__container {
		height: 674px !important;
		padding-bottom: 0;
		overflow: hidden;
	}

	.vc-modal__content {
		display: flex;
		padding: 0 0 63px 0;
		flex: 1;
	}
}

</style>
