export interface ActionItem {
	label: string;
	message?: string;
	tip?: string;
	disabled?: boolean;
	show?: boolean;
	onCancel?: (item: ActionItem) => void;
	onClick?: (item: ActionItem) => void;
	onOk?: (item: ActionItem) => void;
}
