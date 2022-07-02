<template>
	<div :class="{ 'is-inline': inline }" class="vcc-safe-mobile">
		<span class="vcc-safe-mobile__mobile">
			{{ isEncrypted && value ? encryptMobile(value) : value }}
		</span>
		<vc-icon
			v-if="visibleChangeable"
			:type="isEncrypted ? 'invisible' : 'visible'"
			class="vcc-safe-mobile__toggle-icon"
			@click="handleToggle"
		/>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Icon as VcIcon } from '@wya/vc';

const props = defineProps({
	// 手机号码
	value: {
		type: String,
		default: ''
	},
	// 初始可见性
	visible: Boolean,
	// 是否可以切换 visible
	visibleChangeable: {
		type: Boolean,
		default: true
	},
	// 是否以行内元素形式展示
	inline: Boolean
});
const emit = defineEmits(['update:visible']);

const encryptMobile = (str: string) => {
	return str.replace(/^(\d{3})\d+(\d{4})$/, '$1****$2');
};

const isEncrypted = ref(!props.visible);
const handleToggle = () => {
	isEncrypted.value = !isEncrypted.value;
	emit('update:visible', isEncrypted.value);
};
</script>

<style lang="scss">
.vcc-safe-mobile {
	display: flex;
	align-items: center;

	&.is-inline {
		display: inline-flex;
	}

	&__toggle-icon {
		margin-left: 10px;
		font-size: 14px;
		color: #5495f6;
		cursor: pointer;
	}
}
</style>
