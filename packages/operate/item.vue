<template>
	<vc-popconfirm
		v-if="info.message"
		:title="info.message"
		tag="div"
		class="vcc-operate-item"
		@ok="handleOk"
		@cancel="handleCancel"
	>
		<span class="vcc-operate-item__text">
			{{ info.label }}
		</span>
	</vc-popconfirm>
	<div v-else class="vcc-operate-item">
		<span
			class=" vcc-operate-item__text is-inline"
			@click="handleOk"
			v-text="info.label"
		/>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { Popconfirm } from '@wya/vc';
import type { ActionItem } from './action-types';

export default defineComponent({
	name: 'vcc-operate-item',
	components: {
		'vc-popconfirm': Popconfirm
	},
	props: {
		info: {
			type: Object as PropType<ActionItem>,
			default: () => ({})
		}
	},
	emits: ['cancel', 'ok'],
	setup(props, { emit }) {
		const handleCancel = () => {
			emit('cancel');
		};
		const handleOk = () => {
			emit('ok');
		};

		return {
			handleCancel,
			handleOk
		};
	}
});
</script>

<style lang="scss">
.vcc-operate-item {
	display: inline-block;

	.vcc-operate-item__text {
		color: #5495f6;
		cursor: pointer;

		&.is-inline {
			display: inline-block;
			text-align: right;
		}
	}
}

</style>
