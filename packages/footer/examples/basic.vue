<template>
	<div>
		<vcc-footer @ok="handleOk" @cancel="handleCancel" />
	</div>
</template>

<script>
import Footer from '../index.ts';

export default {
	name: 'vcc-basic',
	components: {
		'vcc-footer': Footer
	},
	setup(props) {
		const handleOk = () => {
			// alert('ok');
			return new Promise((r, j) => {
				setTimeout(() => {
					r();
				}, 1000);
			});
		};
		const handleCancel = () => {
			alert('cancel');
		};
		return {
			handleOk,
			handleCancel
		};
	}
};
</script>

<style lang="scss" scoped>
</style>
