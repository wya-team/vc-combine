import { ref, computed } from 'vue';
import { Message } from '@wya/vc';
import { useConfig } from './use-config';
import { isValidMime, getExtsByMimeStr } from '../utils';

export const useFile = (props) => {
	const { valueKey, apis, http, mode, SOURCE_MAP } = useConfig();
	const { fileId } = valueKey;

	const selectedFiles: { value: object[] } = ref([]);
	const selectedFileIds = computed(() => selectedFiles.value.map(item => item[fileId]));
	let fileUploadOpts;

	switch (mode) {
		case 'video':
			fileUploadOpts = {
				size: 50,
				...props.uploadOpts,
				accept: props.uploadOpts.accept || 'video/mp4',
			};
			break;

		case 'audio':
			fileUploadOpts = {
				size: 20,
				...props.uploadOpts,
				accept: props.uploadOpts.accept || 'audio/mp3,audio/aac',
			};
			break;

		default:
			fileUploadOpts = {
				size: 3,
				...props.uploadOpts,
				accept: props.uploadOpts.accept || 'image/jpeg,image/png,image/gif,image/bmp',
			};
	}

	const validFileExts = getExtsByMimeStr(fileUploadOpts.accept, mode);

	/**
	 * 获取文件禁用原因
	 * 1、格式不匹配
	 * 2、文件大小不匹配
	 * 3、时长不匹配（针对媒体文件）
	 *
	 * @param {object} file 文件列表中的文件item对象
	 * @returns {Array} 不可选择的原因
	 */
	const getDisabledReason = (file) => {
		const { fileUrl, fileSize } = valueKey;
		const { size } = fileUploadOpts;
		const reasons: Array<string> = [];
		// 文件格式判断
		!isValidMime(file[fileUrl], validFileExts) && reasons.push('格式不匹配');
		// 文件大小判断
		size > 0 && file[fileSize] > size * 1024 * 1024 && reasons.push(`大小超过${size}M`);
		// 媒体文件时长判断
		mode !== 'image' 
			&& props.maxDuration > 0 
			&& file.duration > props.maxDuration 
			&& reasons.push(`时长超过${props.maxDuration}s`);
		return reasons;
	};

	const loadFiles = async (categoryId, page, pageSize) => {
		const { catId, catType } = valueKey;
		const res = await http({
			url: apis['URL_GALLERY_FILE_LIST'],
			type: 'GET',
			param: {
				page,
				pageSize: 40,
				[catId]: categoryId,
				[catType]: SOURCE_MAP[mode].fileType
			}
		});
		res.data.list.forEach(it => {
			// 禁用原因
			it.disabledReasons = getDisabledReason(it);
			// 是否禁用
			it.disabled = !!it.disabledReasons.length;
		});
		return res;
	};

	const toggleFile = (it: object) => {
		const temp: object[] = [...selectedFiles.value];

		const index = temp.findIndex(item => item[fileId] === it[fileId]);

		if (index === -1) {
			const { max } = props;
			if (!max || temp.length < max) {
				temp.push(it);
			} else if (max === 1) {
				temp.splice(0, 1, it);
			} else {
				Message.info({
					content: `最多选择${max}个，请取消后再进行选择`
				});
				return;
			}
		} else {
			temp.splice(index, 1);
		}

		selectedFiles.value = temp;
	};

	const setSelectedFiles = (value) => {
		selectedFiles.value = value;
	};


	return {
		fileUploadOpts,
		selectedFiles,
		selectedFileIds,

		loadFiles,
		toggleFile,
		setSelectedFiles
	};
};