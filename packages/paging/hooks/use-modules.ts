import { ref, watch, computed, reactive } from 'vue';
import { URL } from '@wya/utils';

const getLabelWidth = length => {
	return `calc(${length}em + 24px)`;
};

const getValue = (module, field, query, childModule) => {
	const { type } = module;
	const { defaultValue } = childModule;
	let value;

	// 级联选择的modelValue需为数组，需解析query上逗号拼接的字符串
	if (type === 'cascader') {
		value = query[field];
		return value ? String(value).split(',') : (defaultValue || []);
	}
	return String(query[field] || defaultValue || '');
};

export const useModules = (props) => {
	const normalizeField = (field, type) => {
		if (type === 'rangeDatePicker') {
			if (Array.isArray(field)) {
				return field;
			}
			if (typeof field === 'string') {
				return [`${field}_start`, `${field}_end`];
			}
			throw new Error('field 应为String或者Array');
		}
		return field;	
	};


	let keywords;
	let maxLength = ref(0);

	const makeKeywords = () => {
		const map = {};
		const { query } = URL.parse();
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
					if (field) {
						if (Array.isArray(field)) {
							field.forEach(_field => {
								// 存在children的module，此时it是activeModule.children的子项，而非activeModule
								map[_field] = getValue(activeModule, _field, query, it);
							});
						} else {
							map[field] = getValue(activeModule, field, query, it);
						}
					}
				}
			});
		};
		
		getFields(props.modules);
		// 递归遍历完后，清除activeModule缓存
		activeModule = null;
		keywords = reactive(map);
	};

	const onModelValueChange = (module, value) => {
		const { type, field } = module;
		if (type === 'rangeDatePicker') {
			const fields = normalizeField(field, type);
			keywords[fields[0]] = value[0];
			keywords[fields[1]] = value[1];
		} else {
			keywords[field] = value;
		}
	};

	const getModelValue = (module) => {
		const { type, field } = module;
		if (type === 'rangeDatePicker') {
			const fields = normalizeField(field, type);
			return [keywords[fields[0]], keywords[fields[1]]];
		}
		return keywords[field];
	};

	const labelWidth = computed(() => getLabelWidth(maxLength.value));

	watch(props.modules, makeKeywords, { immediate: true });

	return {
		keywords,
		labelWidth,
		getModelValue,
		onModelValueChange
	};
};