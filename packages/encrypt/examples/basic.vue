<template>
	<div class="demo-block">
		<h2>默认加密：</h2>
		<vcc-encrypt value="17888888888" />
	</div>
	<div class="demo-block">
		<h2>默认不加密：</h2>
		<vcc-encrypt value="17888888888" visible />
	</div>
	<div class="demo-block">
		<h2>不可切换加密状态：</h2>
		<vcc-encrypt
			value="17888888888"
			disabled
		/>
	</div>
	<div class="demo-block">
		<h2>行内展示：</h2>
		这是我的手机号码：<vcc-encrypt value="17888888888" visible inline />，记得 call 我！
	</div>
</template>

<script setup lang="ts">
import VccEncrypt from '../index';

</script>

<style lang="scss">
.demo-block {
	margin-top: 30px;
	margin-left: 30px;
}
</style>
