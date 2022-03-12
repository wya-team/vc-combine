import { inject } from 'vue';
import { FILTER_KEY } from '../constants';

export const useFilterManager = () => {
	const filterManager = inject(FILTER_KEY);

	return {
		filterManager
	};
};