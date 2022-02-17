// import { computed } from 'vue';

export const commonProps = {
	label: String,
	field: String,
	width: {
		type: Number,
		default: 220
	},
	options: {
		type: Object,
		default: () => ({})
	}
};
