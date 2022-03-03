<template>
	<vc-modal
		v-model="visible"
		:title="`上传${sourceName}`"
		size="medium"
		class="vca-gallery-uploader"
		@ok="handleOk"
	>
		<vc-form
			ref="formRef"
			:model="formData"
			:rules="rules"
			:label-width="120"
		>
			<vc-form-item label="选择分组：" :prop="valueKey.catId">
				<vc-select v-model="formData[valueKey.catId]" style="width: 300px;">
					<vc-option
						v-for="item in categories"
						:key="item[valueKey.catId]"
						:value="item[valueKey.catId]"
					>
						{{ item[valueKey.catName] }}
					</vc-option>
				</vc-select>
			</vc-form-item>
			<vc-form-item v-if="mode !== 'image'" :label="`${sourceName}名称：`" :prop="valueKey.fileName">
				<vc-input
					v-model="formData[valueKey.fileName]"
					clearable
					:placeholder="`请输入${sourceName}名称`"
					style="width: 300px;"
				/>
			</vc-form-item>
			<vc-form-item v-if="mode !== 'image'" label="本地文件：" prop="fileUrls">
				<vc-upload
					v-if="!formData.fileUrls.length"
					:size="uploadOpts.size"
					:max="1"
					show-tips
					:accept="uploadOpts.accept"
					@file-before="handleMediaBefore"
					@begin="handleMediaBegin"
					@file-error="handleMediaError"
					@error="handleMediaError"
					@file-success="handleMediaSuccess"
				>
					<div class="vca-gallery-uploader__upload-box">
						<vc-icon type="plus" style="margin-bottom: 8px; font-size: 14px;" />
						<span>上传</span>
					</div>
				</vc-upload>
				<div v-else class="vca-gallery-uploader__media" @click="handlePreview">
					<vc-image v-if="mode === 'video'" :src="videoPosterUrl" fit="cover" />
					<div class="vca-gallery-uploader__media-mask">
						<div class="vca-gallery-uploader__play">
							<vc-icon type="toplay" />
						</div>
					</div>
					<div class="vca-gallery-uploader__delete" @click.stop="handleDeleteMedia">
						<vc-icon type="clear" />
					</div>
				</div>
				<div style="color: #999;">
					支持 {{ fileMimes }} 格式，{{ sourceName }}文件大小不超过 {{ uploadOpts.size }}Mb
				</div>
			</vc-form-item>
			<vc-form-item v-else label="本地文件：" prop="fileUrls">
				<vc-upload-picker
					v-model="formData.fileUrls"
					:max="10"
					:gallery="false"
					:upload-opts="uploadOpts"
					@success="handleImageSuccess"
				/>
				<div style="color: #999;">
					支持 {{ fileMimes }} 格式，最多10张，单张图片大小不超过 {{ uploadOpts.size }}Mb
				</div>
			</vc-form-item>
		</vc-form>
	</vc-modal>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import {
	Message,
	UploadPicker as VcUploadPicker,
	Modal as VcModal,
	Form as VcForm,
	Select as VcSelect,
	Option as VcOption,
	Input as VcInput,
	Upload as VcUpload,
	Image as VcImage,
	Icon as VcIcon
} from '@wya/vc';
import { VideoPreviewer } from './video-previewer/index';
import { AudioPreviewer } from './audio-previewer/index';
import { SOURCE_MAP } from '../constants';
import { getExtsByMimeStr } from '../utils'; 
import { useConfig } from '../hooks/use-config';

const VcFormItem = VcForm.Item;

const props = defineProps({
	mode: {
		type: String,
		default: 'image',
		validator: value => Object.keys(SOURCE_MAP).includes(value)
	},
	uploadOpts: {
		type: Object,
		default: () => ({})
	},
	catId: Number,
	valueKey: Object,
	categories: Array,
	http: Function,
	apis: Object
});

const emit = defineEmits(['portal-fulfilled']);

const {
	apis,
	http,
	valueKey
} = useConfig();

const formRef = ref();

const { catId, fileName } = valueKey;
const mimes = getExtsByMimeStr(props.uploadOpts.accept, props.mode);

const visible = ref(false);
const formData = reactive({
	[catId]: props.catId,
	[fileName]: '',
	// 文件url数组
	fileUrls: [],
	// 文件信息数组
	list: []
});

const rules = reactive({
	[catId]: [{ required: true, message: '请选择分组' }],
	[fileName]: [{ required: true, message: `请填写文件名称` }],
	fileUrls: [{ required: true, type: 'array', message: '请上传本地文件' }]
});

const fileMimes = mimes.includes('*') ? '所有' : mimes.join('、');
// 资源类型名称
const sourceName = computed(() => SOURCE_MAP[props.mode].name);
const videoPosterUrl = computed(() => {
	if (props.mode !== 'video' || !formData.fileUrls.length) return '';
	// 阿里云视频截帧 -> https://help.aliyun.com/document_detail/64555.html
	return `${formData.fileUrls[0]}?x-oss-process=video/snapshot,t_0,f_png,w_0,h_0,m_fast`;
});

const handleMediaBegin = () => {
	Message.loading({ content: '上传中' });
};

/**
 * 获取媒体文件时长
 * 
 * @param {*} mediaFile file
 * @returns {Promise} Promise
 */
const handleMediaBefore = (mediaFile) => {
	const mediaEl = document.createElement(SOURCE_MAP[props.mode].elementTag);
	mediaEl.preload = 'metadata';
			
	return new Promise((resolve, reject) => {
		let timer = null;
		const handler = () => {
			window.URL.revokeObjectURL(mediaEl.src);
			timer && clearTimeout(timer);
			mediaFile.duration = mediaEl.duration;
			resolve(mediaFile);
		};
		timer = setTimeout(() => {
			mediaEl.removeEventListener('loadedmetadata', handler, false);
					reject({ msg: `获取${sourceName.value}时长失败` }); // eslint-disable-line
		}, 5000);

		mediaEl.addEventListener('loadedmetadata', handler, false);
		mediaEl.src = window.URL.createObjectURL(mediaFile);
	});
};

const handleImageSuccess = (res, file) => {
	const { fileSize, fileUrl } = valueKey;
	formData.list.push({
		[fileName]: res.data.title,
		[fileUrl]: res.data.url,
		[fileSize]: file.size,
	});
	Message.destroy();
};

const handleMediaSuccess = (res, file) => {
	const { fileSize, fileUrl } = valueKey;
	formData.fileUrls.splice(0, 1, res.data.url);
	if (!formData[fileName]) {
		formData[fileName] = res.data.title;
	}
			
	formData.list.splice(0, 1, {
		[fileName]: formData[fileName],
		[fileUrl]: res.data.url,
		[fileSize]: file.size,
		duration: file.duration || 0
	});
	Message.destroy();
};
const handleMediaError = (error) => {
	Message.destroy();
	Message.error({ content: error.msg });
};
const handleDeleteMedia = () => {
	formData.fileUrls.splice(0, 1);
};
const handlePreview = () => {
	if (props.mode === 'video') {
		VideoPreviewer.popup({
			dataSource: formData.fileUrls.slice(0, 1)
		});
	} else {
		AudioPreviewer.popup({
			src: formData.fileUrls[0]
		});
	}
};
/**
 * 保存素材
 */
const handleOk = async () => {
	try {
		await formRef.value.validate();
		const { fileId, fileSize, fileUrl } = valueKey;
		const payload = {
			[catId]: formData[catId],
			// list中可能存在上传后又被删除的文件，但是fileUrls是最新的，所以要根据fileUrls来取
			list: formData.list.filter(it => formData.fileUrls.includes(it[fileUrl]))
		};
		if (props.mode !== 'image') {
			payload.list[0][fileName] = formData[fileName];
		}
		await http({
			url: apis.URL_GALLERY_FILE_UPLOAD,
			type: 'POST',
			param: payload
		});
		emit('portal-fulfilled', { catId: formData[catId] });
	} catch (error) {
		error && console.log(error);
	}
};

onMounted(() => {
	visible.value = true;
});

</script>

<style lang="scss">
.vca-gallery-uploader {
	.vca-gallery-uploader__upload-box {
		display: inline-flex;
		width: 64px;
		height: 64px;
		line-height: 1;
		color: #999;
		cursor: pointer;
		background-color: #f5f5f6;
		border: 1px dashed #d9d9d9;
		border-radius: 4px;
		align-items: center;
		justify-content: center;
		flex-direction: column;
	}

	.vca-gallery-uploader__media {
		position: relative;
		display: flex;
		width: 64px;
		height: 64px;
		cursor: pointer;
		background-color: #fafafa;
		border-radius: 4px;
		justify-content: center;
		align-items: center;

		.vca-gallery-uploader__media-mask {
			position: absolute;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			border-radius: 4px;
		}

		.vca-gallery-uploader__delete {
			position: absolute;
			top: -6px;
			right: -6px;
			z-index: 1;
			display: flex;
			width: 14px;
			height: 14px;
			font-size: 14px;
			color: #5495f6;
			background-color: #fff;
			border-radius: 7px;
			justify-content: center;
			align-items: center;
		}

		.vca-gallery-uploader__play {
			position: absolute;
			top: 50%;
			left: 50%;
			display: flex;
			width: 24px;
			height: 24px;
			background-color: rgba(0, 0, 0, 0.5);
			border: 1px solid #fff;
			border-radius: 50%;
			transform: translate3d(-50%, -50%, 0);
			justify-content: center;
			align-items: center;

			.vc-icon {
				margin-right: -2px;
				font-size: 12px;
				color: #fff;
			}
		}

		.vc-image {
			width: 100%;
			height: 100%;
		}
	}
}

.vc-upload-tips {
	z-index: 99999;
}
</style>
