import type { ExtractPropTypes, PropType } from 'vue';
import { Modules } from './filter-types';

export const filterProps = {
	modules: {
		type: Array as PropType<Modules>,
		default: () => []
	},
	outerCount: {
		type: Number,
		default: 1
	},
	history: Boolean,
	router: Boolean
};

export type FilterProps = ExtractPropTypes<typeof filterProps>
