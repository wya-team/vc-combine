
export const commonProps = {
	label: String,
	field: String,
	labelWidth: String,
	width: {
		type: Number,
		default: 220
	},
	options: {
		type: Object,
		default: () => ({})
	}
};
