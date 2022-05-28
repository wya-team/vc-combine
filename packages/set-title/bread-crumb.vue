<!-- 集成业务的面包屑，暂不考虑抽离 -->
<template>
	<div :style="{ left: `${leftW}px` }" class="vcc-bread-crumb">
		<div 
			v-for="(route, index) in routes"
			:key="index"
		>
			<span 
				:class="index === routes.length - 1 ? 'vcc-bread-crumb__black' : route.path && 'vcc-bread-crumb__link'"
				@click="route.path && $router.push(route.path)"
			>
				{{ route.name }}
			</span>
			<span v-if="index < routes.length - 1" class="vcc-bread-crumb__divider">/</span>
		</div>
		<vc-button v-if="showBack" type="primary" style="margin-left: 20px;" @click="handleBack">
			返回
		</vc-button>
	</div>
</template>

<script>
import { defineComponent, ref, onBeforeMount, onMounted, onUnmounted, getCurrentInstance } from 'vue';
import { Button } from '@wya/vc';

/**
 * 需要业务层实现$global的eventbus
 */
export default defineComponent({
	name: 'vcc-bread-crumb',
	components: {
		'vc-button': Button
	},
	props: {
		routes: {
			type: Array,
			default() {
				return [];
			}
		},
		showBack: {
			type: Boolean,
			default: false
		}
	},
	emits: ['back'],
	setup(_props, { emit }) {
		const globalProperties = getCurrentInstance().appContext.config.globalProperties;

		const leftW = ref(0);
		const handleResize = ({ distance }) => {
			leftW.value !== distance && (leftW.value = distance);
		};
		const handleBack = () => {
			const route = _props.routes.slice(-2, -1);
			if (route.length) {
				globalProperties?.$router?.replace?.(route[0].path);
			}
			emit('back');
		};
		onBeforeMount(() => {
			globalProperties.$global?.on?.('layout-left-menu', handleResize);
		});

		onMounted(() => {
			// 让left-menu 再次告知它自己当前的宽度
			globalProperties.$global?.emit?.('layout-top-menu', { distance: 55 });
			globalProperties.$global?.emit?.('layout-left-menu-emit-again', { emit: true });
		});

		onUnmounted(() => {
			globalProperties.$global?.emit?.('layout-top-menu', { distance: 0 });
			globalProperties.$global?.off?.('layout-left-menu', handleResize);
		});

		return {
			leftW,
			handleResize,
			handleBack
		};
	}
});
</script>

<style lang="scss">
.vcc-bread-crumb {
	position: fixed;
	top: 0;
	right: 0;
	z-index: 999;
	display: flex;
	height: 56px;
	padding: 0 15px;
	font-size: 14px;
	background-color: #fff;
	border-bottom: 1px solid #d9d9d9;
	align-items: center;

	&__link {
		color: #676767;
		cursor: pointer;

		&:hover {
			color: #5495f6;
		}
	}

	&__divider {
		margin: 0 6px;
	}

	&__black {
		color: #000;
	}
}
</style>




