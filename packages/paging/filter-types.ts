import type { Ref } from 'vue';

export type FilterModuleField = string | [string, string]

export type FieldValue = string | number

export type LabelValueItem<T extends true | false = false> = {
	label: string;
	value: number | string;
	children?: T extends true ? LabelValueItem<T>[] : never;
}

export type CascaderLabelValueItem = LabelValueItem<true>

export type SelectDataSource = LabelValueItem[] | (() => LabelValueItem[] | Ref<LabelValueItem[]>)

export interface ModuleBase {
	type: string;
	label?: string;
	labelWidth?: string;
	width?: number;
	show?: boolean;
}

export interface BindOptions {
	options?: object;
	hooks?: object;
}

export type FormItemIndicator = ModuleWithoutChildren | RangeItem

export interface RangeItem extends BindOptions {
	field: string;
}

export type GetSelectModule<T extends 'select' | 'multipleSelect'> = ModuleBase & BindOptions & {
	type: T;
	field: string;
	dataSource: SelectDataSource;
}

// 输入项
export interface InputModule extends ModuleBase, BindOptions {
	type: 'input';
	field: string;
	modelValue: string;
}

// 下拉选择项
export type SelectModule = GetSelectModule<'select'>

// 多选下拉选择项
export type MultipleSelectModule = GetSelectModule<'multipleSelect'>

// 范围输入项
export interface RangeModule extends ModuleBase {
	type: 'range';
	modelValue: number | string | (number | string)[];
	children: [RangeItem, RangeItem];
}

// 级联选择项
export interface CascaderModule extends ModuleBase, BindOptions {
	type: 'cascader';
	field: string;
	dataSource: CascaderLabelValueItem[] | (() => CascaderLabelValueItem[] | Ref<CascaderLabelValueItem[]>);
}

// 下拉组合项
export interface SelectComboModule {
	type: 'selectCombo';
	label?: string;
	labelWidth?: string;
	show?: boolean;
	gap?: number;
	children: [SelectModule, Module];
}

// 时间选择项
export interface DatePickerModule extends ModuleBase, BindOptions {
	type: 'datePicker';
	field: string;
}

// 时间范围选择项
export interface RangeDatePickerModule extends ModuleBase, BindOptions {
	type: 'rangeDatePicker';
	field: string | [string, string];
}


export type Module = InputModule | SelectModule | MultipleSelectModule | RangeModule
| CascaderModule | SelectComboModule | DatePickerModule | RangeDatePickerModule

export type ModuleWithoutChildren = Exclude<Module, RangeModule | SelectComboModule>

export type Modules = Module[]

export interface FilterFieldCtx {
	reset(): void;
}

export interface FilterManager {
	addField(field: FilterModuleField, ctx: FilterFieldCtx): void;
	removeField(field: FilterModuleField): Promise<void>;
}

export type FieldMap = Map<FilterModuleField, FilterFieldCtx>
