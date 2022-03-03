import { SOURCE_MAP, fieldMap } from '../constants';

interface configData {
	mode: string,
	apis: Object,
	http: Function,
	valueKey: fieldMap,
	sourceName: string
}

let config: configData;

export const useConfig = () => {
	const setConfig = (data: configData) => {
		config = data;
	};

	return {
		SOURCE_MAP,
		...config,
		setConfig
	};
};