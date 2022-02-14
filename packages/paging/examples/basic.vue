<!-- 仅展示最基本的用法 -->
<template>
	<div style="padding: 20px;">
		<h1>Basic</h1>
		<vcc-paging />
	</div>
</template>
<script>
import { defineComponent } from 'vue'; 
import Paging from '../index.ts';

export default defineComponent({
	name: "vcc-paging-basic",
	components: {
		'vcc-paging': Paging,
	}
});
</script>
