<template>
	<div>
		<vcc-table
			:data-source="data"
			name="id"
			:max="1"
			show-select
			@select="handleData"
		/>
	</div>
	
	<vcc-table
		:data-source="data"
		:multiple="false"
		:selected="[1]"
		show-select
		name="id"
		@select="handleData"
	/>
</template>
<script>
import { ref, reactive, defineComponent } from 'vue';
import Table from '../index.ts';

export default defineComponent({
	name: "vcc-table-basic",
	components: {
		'vcc-table': Table,
	},

	setup() {
		const data = ref([{ id: 1 }, { id: 2 }]);
		const handleData = (v) => {
			console.log(v);
		};
		return {
			data,
			handleData
		};
	}
});
</script>
