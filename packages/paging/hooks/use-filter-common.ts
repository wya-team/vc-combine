export const commonProps = {
	type: String,
	label: String,
	field: {
		type: String,
		default: '',
		required: true
	},
	labelWidth: String,
	width: {
		type: Number,
		default: 220
	},
	options: {
		type: Object,
		default: () => ({})
	},
	// 事件绑定，如：{ change: handleChange }
	hooks: {
		type: Object,
		default: () => ({})
	}
};
