<template>
	<vc-modal
		v-model="visible"
		title="音频预览"
		cancel-text=""
		class="vca-gallery-audio-previewer"
		@close="handleClose"
		@ok="handleClose"
	>
		<div v-if="name" class="vca-gallery-audio-previewer__name">
			音频文件名称：{{ name }}
		</div>
		<audio 
			ref="audioRef"
			:src="src"
			controls
			autoplay
			class="vca-gallery-audio-previewer__audio"
		/>
	</vc-modal>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import {
	Modal as VcModal
} from '@wya/vc';

const props = defineProps({
	src: String,
	name: String
});

const audioRef = ref();
const visible = ref(false);
const handleClose = () => {
	videoRef.value.pause();
	visible.value = false;
};

onMounted(() => {
	visible.value = true;
});
</script>

<style lang="scss">
.vca-gallery-audio-previewer {
	.vca-gallery-audio-previewer__name {
		margin-bottom: 16px;
		font-size: 14px;
		color: #333;
	}

	.vc-modal__mask,
	.vc-modal__wrapper {
		z-index: 1100;
	}
}
</style>
