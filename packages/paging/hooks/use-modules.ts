import { watch, reactive } from 'vue';
import { URL } from '@wya/utils';

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

	const makeKeywords = () => {
		const map = {};
		const { query } = URL.parse();
		let field;
		const getFields = (fieldItems) => {
			fieldItems.forEach(it => {
				if (it.children && it.children.length) {
					getFields(it.children);
				} else {
					field = normalizeField(it.field, it.type);
					if (field) {
						if (Array.isArray(field)) {
							field.forEach(_field => {
								map[_field] = String(query[_field] || '');
							});
						} else {
							map[field] = String(query[field] || '');
						}
					}
				}
			});
		};
		getFields(props.modules);
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

	watch(props.modules, makeKeywords, { immediate: true });

	return {
		keywords,
		getModelValue,
		onModelValueChange
	};
};