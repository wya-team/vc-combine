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
	</div>
</template>

<script>
import { defineComponent, ref, onBeforeMount, onMounted, onUnmounted, getCurrentInstance } from 'vue';

/**
 * 需要业务层实现$global的eventbus
 */
export default defineComponent({
	name: 'vcc-bread-crumb',
	props: {
		routes: {
			type: Array,
			default() {
				return [];
			}
		}
	},
	setup(_props) {
		const globalProperties = getCurrentInstance().appContext.config.globalProperties;

		const leftW = ref(0);
		const handleResize = ({ distance }) => {
			leftW.value !== distance && (leftW.value = distance);
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
			globalProperties.$global?.off?.('layout-left-menu', handleResize);
		});

		return {
			leftW,
			handleResize
		};
	}
});
</script>

<style lang="scss">
.vcc-bread-crumb {
	position: fixed;
	top: 0px;
	right: 0;
	z-index: 999;
	background-color: #ffffff;
	padding: 0 15px;
	border-bottom: 1px solid #d9d9d9;
	height: 56px;
	font-size: 14px;
	display: flex;
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




