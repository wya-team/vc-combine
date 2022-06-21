import { ref, watch, computed } from 'vue';
import { URL } from '@wya/utils';
import type {
	Module,
	FieldValue,
	FilterModuleField,
	FormItemIndicator,
	ModuleWithoutChildren
} from '../filter-types';

export type GetModelValue = (module: FormItemIndicator) => unknown

export type OnModelValueChange = (
	module: FormItemIndicator,
	value: FieldValue[] | FieldValue
) => void

const getLabelWidth = (length: number) => {
	return `calc(${length}em + 24px)`;
};

// modelValue需为数组的 filter type
const ARRAY_TYPES = [
	'cascader', // 级联
	'multipleSelect' // 多选select
];

const getValue = (module, field, historyData, childModule) => {
	const { type } = module;
	const { defaultValue } = childModule;
	let value;

	// modelValue需为数组的，需单独处理
	if (ARRAY_TYPES.includes(type)) {
		value = historyData[field];
		// history为true的模式下，是从query上取的逗号拼接的字符串
		return value
			? Array.isArray(value)
				? value
				: String(value).split(',')
			: (defaultValue || []);
	}
	return String(
		historyData[field]
		|| (typeof defaultValue !== 'undefined' ? defaultValue : '')
	);
};

export const useModules = (props, modules) => {
	const normalizeField = (field: FilterModuleField, type: Module['type']) => {
		if (type === 'rangeDatePicker') {
			if (Array.isArray(field)) {
				return field;
			}
			if (typeof field === 'string') {
				return [`${field}_start`, `${field}_end`];
			}
			throw new Error('时间范围筛选项的 field 应为 String 或者 Array 类型');
		}
		return field;
	};


	let keywords = ref({});
	let maxLength = ref(0);

	const makeKeywords = () => {
		const map = {};
		const { query } = URL.parse();
		const historyData = props.history
			? { ...query, ...keywords.value }
			: keywords.value;
		let field;
		let length;
		// 记录当前正在处理的module
		let activeModule = null;

		const getFields = (fieldItems) => {
			fieldItems.forEach(it => {
				const type = it.type;
				if (type) {
					activeModule = it;
				}

				length = it.label && it.label.length;
				if (length && length > maxLength.value) {
					maxLength.value = length;
				}

				if (it.children && it.children.length) {
					getFields(it.children);
				} else {
					field = normalizeField(it.field, type);
					it.field = field;

					if (field) {
						if (Array.isArray(field)) {
							field.forEach(_field => {
								// 存在children的module，此时it是activeModule.children的子项，而非activeModule
								map[_field] = getValue(activeModule, _field, historyData, it);
							});
						} else {
							map[field] = getValue(activeModule, field, historyData, it);
						}
					}
				}
			});
		};

		getFields(modules.value);
		// 递归遍历完后，清除activeModule缓存
		activeModule = null;
		keywords.value = map;
	};

	const onModelValueChange: OnModelValueChange = (module, value) => {
		const { field } = module;
		const { type } = module as ModuleWithoutChildren;
		if (type === 'rangeDatePicker') {
			const fields = normalizeField(field, type);
			keywords.value[fields[0]] = value[0];
			keywords.value[fields[1]] = value[1];
		} else {
			keywords.value[field as string] = value;
		}
	};

	const getModelValue: GetModelValue = (module) => {
		const { field } = module;
		const { type } = module as ModuleWithoutChildren;
		if ((type) === 'rangeDatePicker') {
			const fields = normalizeField(field, type);
			return [keywords.value[fields[0]], keywords.value[fields[1]]];
		}
		return keywords.value[field as string];
	};

	const labelWidth = computed(() => getLabelWidth(maxLength.value));

	watch(modules, makeKeywords, { immediate: true });

	return {
		keywords,
		labelWidth,
		getModelValue,
		onModelValueChange
	};
};
