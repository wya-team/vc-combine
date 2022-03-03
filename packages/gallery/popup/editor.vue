
<template>
	<vc-modal
		v-model="isVisible"
		:closable="true"
		:mask-closable="false"
		size="small"
		class="vca-gallery-editor"
	>
		<template #header>
			<div class="vca-gallery-editor__header">
				<div>{{ title }}</div>
				<div @click="handleClose">
					<vc-icon type="close" />
				</div>
			</div>
		</template>
		<vc-input
			ref="inputRef"
			v-model="name"
			:placeholder="placeholder"
			:maxlength="maxlength"
			clearable
			autofocus
			class="vca-gallery-editor__input"
			@enter="handleConfirm"
		/>
		<template #footer>
			<vc-button
				class="vca-gallery-editor__reset-btn"
				@click="handleReset"
			>
				{{ cancelText }}
			</vc-button>
			<vc-button 
				type="primary" 
				class="vca-gallery-editor__confirm-btn"
				@click="handleConfirm"
			>
				{{ okText }}
			</vc-button>
		</template>
	</vc-modal>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import {
	Modal as VcModal,
	Input as VcInput,
	Button as VcButton,
	Icon as VcIcon
} from '@wya/vc';

const props = defineProps({
	title: {
		type: String,
		default: ''
	},
	originalText: {
		type: String,
		default: ''
	},
	placeholder: {
		type: String,
		default: '请填写'
	},
	cancelText: {
		type: String,
		default: '恢复默认'
	},
	okText: {
		type: String,
		default: '保存'
	},
	maxlength: {
		type: Number,
		default: Number.MAX_SAFE_INTEGER
	}
});

const emit = defineEmits(['portal-fulfilled']);

const inputRef = ref();
const isVisible = ref(false);
const name = ref(props.originalText);

const handleClose = () => {
	isVisible.value = false;
};

const handleConfirm = () => {
	isVisible.value = false;
	emit('portal-fulfilled', { inputValue: name.value });
};

const handleReset = () => {
	name.value = props.originalText;
	inputRef.value.focus();
};

onMounted(() => {
	isVisible.value = true;
	inputRef.value.focus();
});

</script>

<style lang="scss">

$block: vca-gallery-editor;

.vca-gallery-editor {
	&__header {
		display: flex;
		width: 100%;
		justify-content: space-between;
	}

	&__reset-btn {
		margin-right: 12px;
	}

	&__input {
		margin-top: 60px;
	}

	.vc-modal__mask {
		z-index: 1002;
	}

	.vc-modal__content {
		padding: 14px 24px;
	}
}
</style>
