<template>
	<vc-modal
		v-model="visible"
		title=""
		class="vca-gallery-video-previewer"
		mask-closable
		@close="handleClose"
	>
		<div class="vca-gallery-video-previewer__video-wrapper">
			<video 
				ref="videoRef"
				:src="srcList[0]"
				controlslist="nodownload"
				class="vca-gallery-video-previewer__video"
				controls
				autoplay
				disablePictureInPicture
			/>
		</div>
		<div class="vca-gallery-video-previewer__close-wrapper">
			<vc-icon type="close" class="vca-gallery-video-previewer__close" @click="handleClose" />
		</div>
	</vc-modal>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import {
	Modal as VcModal,
	Icon as VcIcon
} from '@wya/vc';

const props = defineProps({
	/**
	 * 视频数据，目前只支持一个视频预览
	 * TODO：多个视频切换预览，类似于imgs-preview ？？
	 */
	dataSource: {
		type: Array,
		default: () => ([])
	}
});

const videoRef = ref();

const visible = ref(false);
const srcList = computed(() => {
	return props.dataSource.map(it => {
		return typeof it === 'string' ? it : it.src;
	});
});

const handleClose = () => {
	videoRef.value.pause();
	visible.value = false;
};

onMounted(() => {
	visible.value = true;
});
</script>

<style lang="scss">

.vca-gallery-video-previewer {
	position: relative;
	width: 80%;

	&__video-wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
	}

	&__video {
		width: 60vw;
		max-width: 100%;
		max-height: 100%;
		outline: none;
	}

	&__close-wrapper {
		position: absolute;
		top: 12px;
		right: 12px;
		display: flex;
		width: 32px;
		height: 32px;
		font-size: 16px;
		color: #fff;
		cursor: pointer;
		background: rgba(0, 0, 0, 0.3);
		border-radius: 50%;
		justify-content: center;
		align-items: center;
	}

	.vc-modal__header,
	.vc-modal__footer {
		display: none;
	}

	.vc-modal__container,
	.vc-modal__content {
		min-height: auto !important;
		padding: 0;
	}
}
</style>
