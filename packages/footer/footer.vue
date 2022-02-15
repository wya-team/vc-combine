<template>
	<div
		:style="{
			'left': `${leftMenuWidth ? leftMenuWidth + 12 : 0}px`,
			'width': `calc(100% - ${(leftMenuWidth ? leftMenuWidth + 24 : 0) + assistWidth}px)`
		}"
		class="vcc-footer"
	>
		<slot>
			<vc-button
				v-if="cancelText"
				class="vcc-footer__cancel"
				type="default"
				@click="handleCancel"
			>
				{{ cancelText }}
			</vc-button>
			<vc-button
				v-if="okText"
				:disabled="okDisabled"
				type="primary"
				@click="handleOk"
			>
				{{ okText }}
			</vc-button>
		</slot>
	</div>
</template>
<script>
import { defineComponent, ref, onBeforeMount, onMounted, onUnmounted, getCurrentInstance } from 'vue';
import { Button } from '@wya/vc';

export default defineComponent({
	name: 'vcc-footer',
	components: {
		'vc-button': Button
	},
	props: {
		cancelText: {
			type: String,
			default: '取消',
		},
		okText: {
			type: String,
			default: '保存',
		},
		okDisabled: {
			type: Boolean,
			default: false
		}
	},
	emits: ['cancel', 'ok'],
	setup(props, { emit }) {
		const { appContext, vnode } = getCurrentInstance();
		const globalProperties = appContext.config.globalProperties;

		let leftMenuWidth = ref(0);
		let assistWidth = ref(0);

		const handleSetLeftDistance = ({ distance }) => {
			leftMenuWidth.value !== distance && (leftMenuWidth.value = distance);
		};
		const handleSetAssistWidth = ({ width }) => {
			assistWidth.value !== width && (assistWidth.value = width);
		};
		const handleCancel = (...rest) => {
			let { onCancel } = vnode.props;
			return onCancel ? onCancel(...rest) : emit('cancel', ...rest);		
		};
		const handleOk = (...rest) => {
			let { onOk } = vnode.props;
			return onOk ? onOk(...rest) : emit('ok', ...rest);
		};

		onBeforeMount(() => {
			globalProperties.$global?.on?.('layout-left-menu', handleSetLeftDistance);
			globalProperties.$global?.on?.('layout-assist-change', handleSetAssistWidth);
		});

		onMounted(() => {
			globalProperties.$global?.emit?.('layout-left-menu-emit-again', { emit: true });
		});

		onUnmounted(() => {
			globalProperties.$global?.off?.('layout-left-menu', handleSetLeftDistance);
			globalProperties.$global?.off?.('layout-assist-change', handleSetAssistWidth);
		});

		return {
			leftMenuWidth,
			assistWidth,
			handleCancel,
			handleOk
		};
	}

});
</script>
<style lang="scss">
.vcc-footer {
	position: fixed;
	bottom: 0;
	height: 56px;
	background-color: #FFF;
	z-index: 50;
	display: flex;
	justify-content: center;
	align-items: center;
	box-shadow: 0 -2px 10px 0 rgba(0, 0, 0, 0.08) !important;
	&__cancel {
		margin-right: 12px;
	}
}
</style>
