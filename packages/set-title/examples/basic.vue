<!-- 仅展示最基本的用法 -->
<template>
	<div style="padding: 20px;">
		<h1>Basic</h1>
		<vcc-set-title title="222" :routes="[{ name: '1' }, { name: '2' } ]" />
	</div>
</template>
<script>
import { defineComponent } from 'vue'; 
import SetTitle from '../index.ts';

export default defineComponent({
	name: "vcc-paging-basic",
	components: {
		'vcc-set-title': SetTitle,
	}
});
</script>

<style lang="scss">
.vca-bread-crumb {
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