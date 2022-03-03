<template>
	<div class="vca-gallery-file-item">
		<div
			:class="{ 'is-checked': checked || disabled, 'is-disabled': disabled }"
			class="vca-gallery-file-item__file-wrapper"
			:title="disabled || it.disabled ? '该项不可选' : '该项可选'"
			@click="handleToggle"
		>
			<vc-image
				v-if="it[valueKey.fileType] !== 3"
				:src="videoPosterUrl || `${it[valueKey.fileUrl]}!4-4`"
				class="vca-gallery-file-item__img"
			/>
			<div v-show="checked || disabled" class="vca-gallery-file-item__checked-icon-wrapper">
				<vc-icon type="correct" class="vca-gallery-file-item__checked-icon" />
			</div>
			<div v-if="it.disabled" class="vca-gallery-file-item__disabled-reason">
				<div v-for="(item, index) in it.disabledReasons" :key="index">
					{{ index + 1 }}.{{ item }}
				</div>
			</div>
			<div 
				v-if="it[valueKey.fileType] === 1"
				class="vca-gallery-file-item__preview-icon-wrapper"
				title="点击预览"
				@click.stop="handlePlay(it, $event)"
			>
				<vc-icon type="visible" class="vca-gallery-file-item__preview-icon" />
			</div>
			<template v-else>
				<div 
					class="vca-gallery-file-item__preview-icon-wrapper"
					title="点击预览"
					@click.stop="handlePlay(it, $event)"
				>
					<vc-icon type="toplay" class="vca-gallery-file-item__play-icon" />
				</div>
				<div class="vca-gallery-file-item__duration">
					{{ duration }}
				</div>
			</template>
		</div>
		<div class="vca-gallery-file-item__name-wrapper">
			<span class="vca-gallery-file-item__name" :title="it[valueKey.fileName]">{{ it[valueKey.fileName] }}</span>
			<vc-icon type="edit" class="vca-gallery-file-item__name-edit-icon" @click="handleRename" />
		</div>
	</div>
</template>

<script setup>
import { computed } from 'vue';
import { Icon as VcIcon, Image as VcImage, Message, ImagePreview } from '@wya/vc';
import { Editor, MoveFile, VideoPreviewer, AudioPreviewer } from './popup';
import { useConfig } from './hooks';
import { paddingZero } from './utils';

const {
	apis,
	http,
	valueKey,
	sourceName
} = useConfig();

const props = defineProps({
	it: {
		type: Object,
		default: () => ({})
	},
	checked: {
		type: Boolean,
		default: false
	},
	disabled: {
		type: Boolean,
		default: false
	}
});

const emit = defineEmits(['update:it', 'toggle']);

const duration = computed(() => {
	const _duration = props.it.duration;
	const hours = Math.floor(_duration / (60 * 60));
	let rest = _duration % (60 * 60);
	const minutes = Math.floor(rest / 60);
	rest %= 60;
	return `${paddingZero(hours)}:${paddingZero(minutes)}:${paddingZero(rest)}`;
});

const videoPosterUrl = computed(() => {
	const { fileUrl, fileType } = valueKey;
	// 阿里云视频截帧 -> https://help.aliyun.com/document_detail/64555.html
	return props.it[fileType] === 2 
		? `${props.it[fileUrl]}?x-oss-process=video/snapshot,t_0,f_png,w_0,h_0,m_fast`
		: '';
});

const handleRename = () => {
	const { fileName, fileId } = valueKey;
	Editor.popup({
		title: `${sourceName}重命名`,
		originalText: props.it[fileName],
		placeholder: `请输入新的${sourceName}名称`,
		maxlength: 10
	}).then(async ({ inputValue }) => {
		const v = inputValue || props.it[fileName];
		await http({
			url: apis['URL_GALLERY_FILE_RENAME'],
			type: 'POST',
			param: {
				[fileId]: props.it[fileId],
				[fileName]: v
			}
		});

		emit('update:it', Object.assign(props.it, { [fileName]: v }));
	}).catch(() => {});
};

const handleToggle = () => {
	if (props.disabled || props.it.disabled) return;
	emit('toggle');
};

const handlePlay = (item, event) => {
	const { fileName, fileType, fileUrl } = valueKey;
	const type = item[fileType];
	// 音频
	if (type === 3) {
		AudioPreviewer.popup({
			src: item[fileUrl],
			name: item[fileName]
		});
		// 视频
	} else if (type === 2) {
		VideoPreviewer.popup({
			dataSource: [item[fileUrl]]
		});
		// 图片
	} else {
		let pos = {};
		try {
			const target = event.target; // 先得到pos, 否则getThumbBoundsFn再计划，target已变化（比如弹窗transition的影响）
			const pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
			const rect = target.getBoundingClientRect();

			pos = { x: rect.left, y: rect.top + pageYScroll, w: rect.width };

		} catch (e) {
			console.log(e);
		}

		const url = item[fileUrl];
		ImagePreview.open({
			dataSource: [{
				src: url,
				thumbnail: url,
				title: item[fileName]
			}],
			opts: {
				index: 0,
				history: false,
				getThumbBoundsFn: (index) => pos
			},
		});
	}
};

</script>

<style lang="scss">

.vca-gallery-file-item {
	display: inline-block;
	width: 104px;
	overflow: hidden;
	border-radius: 4px;

	&__file-wrapper {
		position: relative;
		z-index: 0;
		display: flex;
		width: 104px;
		height: 104px;
		overflow: hidden;
		cursor: pointer;
		background: #f8f8f8;
		border: 1px solid transparent;
		border-radius: 4px;
		justify-content: center;
		align-items: center;

		&.is-checked {
			border-color: #5495f6;

			.vca-gallery-file-item__checked-icon-wrapper {
				position: absolute;
				right: 0;
				bottom: 0;
				z-index: 10;
				border-color: transparent #5495f6 #5495f6 transparent;
				border-style: solid;
				border-width: 10px 12px;
			}

			.vca-gallery-file-item__checked-icon {
				position: absolute;
				top: -2px;
				right: -10px;
				font-size: 8px;
				color: #fff;
			}
		}

		&.is-disabled {
			border-color: rgba(84, 149, 246, 0.5);

			.vca-gallery-file-item__checked-icon-wrapper {
				border-color: transparent rgba(84, 149, 246, 0.5) rgba(84, 149, 246, 0.5) transparent;
			}
		}
	}

	&__disabled-reason {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		display: none;
		padding: 8px;
		font-size: 10px;
		color: #fff;
		background: rgba(0, 0, 0, 0.5);
	}

	&__preview-icon-wrapper {
		position: absolute;
		top: 50%;
		left: 50%;
		display: flex;
		width: 32px;
		height: 32px;
		margin-top: -16px;
		margin-left: -16px;
		background: rgba(0, 0, 0, 0.5);
		border: 1px solid #fff;
		border-radius: 50%;
		opacity: 0;
		transform: scale(0);
		transition: all 0.2s 0.15s ease;
		justify-content: center;
		align-items: center;
	}

	&__play-icon {
		margin-right: -4px;
		font-size: 18px;
		color: #fff;
	}

	&__preview-icon {
		font-size: 18px;
		color: #fff;
	}

	&:hover {
		.vca-gallery-file-item__preview-icon-wrapper {
			display: flex;
			opacity: 1;
			transform: scale(1);
			justify-content: center;
			align-items: center;
		}

		.vca-gallery-file-item__disabled-reason {
			display: block;
		}
	}

	&__duration {
		position: absolute;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 9;
		width: 100%;
		height: 20px;
		padding-left: 4px;
		font-size: 12px;
		line-height: 20px;
		color: #fff;
		background: rgba(0, 0, 0, 0.5);
	}

	&__img {
		width: 104px;
		height: 104px;
		border: none;

		img {
			object-fit: cover;
		}
	}

	&__name-edit-icon {
		display: none;
		color: #5495f6;
		cursor: pointer;
		flex-shrink: 0;
	}

	&__name-wrapper {
		display: flex;
		height: 22px;
		margin-top: 5px;
		line-height: 22px;
		justify-content: space-between;
		align-items: center;

		&:hover {
			.vca-gallery-file-item__name-edit-icon {
				display: inline-block;
			}
		}
	}

	&__name {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		flex: 1;
	}

	&__toolbar {
		display: flex;
		justify-content: space-between;
	}

	&__tool {
		font-size: 12px;
		color: #5495f6;
		cursor: pointer;
	}
}
</style>
