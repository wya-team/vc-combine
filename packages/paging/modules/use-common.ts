
export const commonProps = {
	label: String,
	field: String,
	labelWidth: Number,
	width: {
		type: Number,
		default: 220
	},
	options: {
		type: Object,
		default: () => ({})
	}
};
