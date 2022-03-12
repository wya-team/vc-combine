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
	},
	// 事件绑定，如：{ change: handleChange }
	hooks: {
		type: Object,
		default: () => ({})
	}
};
