<template>
	<vcc-section-title content="22" />
</template>
<script>
import { defineComponent, getCurrentInstance } from 'vue';
import vcc from '../index.ts';

export default defineComponent({
	setup() {
		const { app } = getCurrentInstance().appContext;
		app.use(vcc, {});
		return {};
	}
});
</script>
