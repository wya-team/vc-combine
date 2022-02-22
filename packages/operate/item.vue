<template>
	<vc-popconfirm
		v-if="info.message"
		:title="info.message"
		@ok="handleOk"
		@cancel="handleCancel"
	>
		<span class="vcc-operate-item__text">
			{{ info.label }}
		</span>
	</vc-popconfirm>
	<span
		v-else
		class="vcc-operate-item__text is-inline"
		@click="handleOk"
		v-text="info.label"
	/>
</template>

<script>
import { defineComponent } from 'vue';
import { Popconfirm } from '@wya/vc';

export default defineComponent({
	name: 'vcc-operate-item',
	components: {
		'vc-popconfirm': Popconfirm
	},
	props: {
		info: {
			type: Object,
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
.vcc-operate-item__text {
	color: #5495f6;
	cursor: pointer;

	&.is-inline {
		display: inline-block;
		text-align: right;
	}
}
</style>
