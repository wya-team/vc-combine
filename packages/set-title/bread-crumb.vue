<!-- 集成业务的面包屑，暂不考虑抽离 -->
<template>
	<div :style="{ left: `${leftW}px` }" class="vca-bread-crumb">
		<div 
			v-for="(route, index) in routes"
			:key="index"
		>
			<span 
				:class="index === routes.length - 1 ? 'vca-bread-crumb__black' : route.path && 'vca-bread-crumb__link'"
				@click="route.path && $router.push(route.path)"
			>
				{{ route.name }}
			</span>
			<span v-if="index < routes.length - 1" class="vca-bread-crumb__divider">/</span>
		</div>
	</div>
</template>

<script>
import { defineComponent, ref, onBeforeMount, onMounted, onUnmounted, getCurrentInstance } from 'vue';

export default defineComponent({
	name: 'vca-bread-crumb',
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




