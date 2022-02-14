<template>
	<div>
		<vcc-section-title>
			title
		</vcc-section-title>

		<vcc-section-title style="margin-top: 20px;" content="title" />
	</div>
</template>

<script>
import SectionTitle from '../index.ts';

export default {
	name: 'vca-basic',
	components: {
		'vcc-section-title': SectionTitle
	}
};
</script>

<style lang="scss" scoped>
</style>
