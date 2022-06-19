import { inject } from 'vue';
import type { FilterManager } from '../filter-types';
import { FILTER_KEY } from '../constants';

export const useFilterManager = () => {
	const filterManager = inject(FILTER_KEY) as FilterManager;

	return {
		filterManager
	};
};
