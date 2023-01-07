<template>
	<div :class="{ 'is-inline': inline }" class="vcc-safe-mobile">
		<span class="vcc-safe-mobile__mobile">
			{{ isEncrypted && value ? encrypt(value) : value }}
		</span>
		<vc-icon
			v-if="!disabled"
			:type="isEncrypted ? 'invisible' : 'visible'"
			class="vcc-safe-mobile__toggle-icon"
			@click="handleToggle"
		/>
	</div>
</template>

<script lang="ts">
export default {
	name: 'vcc-encrypt'
};
</script>

<script setup lang="ts">
import { ref } from 'vue';
import { Icon as VcIcon } from '@wya/vc';

const props = defineProps({
	value: {
		type: String,
		default: ''
	},
	// 初始可见性
	visible: Boolean,
	disabled: {
		type: Boolean,
		default: false
	},
	// 是否以行内元素形式展示
	inline: Boolean,
	from: {
		type: Number,
		default: 3
	},
	length: {
		type: Number,
		default: 4
	}
});
const emit = defineEmits(['update:visible']);

const encrypt = (v) => {
	v = v || '';
	let repeat = props.length || 0;
	let content = v.substring(0, props.from);

	while (repeat) {
		content += '*';
		repeat--;
	}

	content += v.substring(props.from + props.length);
	return content;
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
