/**
 * TODO: 使用vc下的useListeners，等他更新后移除
 */
import {
	getCurrentInstance,
	ref,
	watchEffect
} from 'vue';
import { kebabCase } from 'lodash';

export const useListeners = (options: Options = {}) => {
	const { exclude = [] } = options;
	const instance = getCurrentInstance();
	const listeners = ref({});

	watchEffect(() => {
		const res = Object.entries(instance?.vnode?.props || {})
			.reduce((pre, [key, val]) => {
				if (exclude.includes(key)) return pre;
				if (/^on([A-Z])/.test(key)) {
					key = kebabCase(key.replace(/^on([^\s]+)/, "$1"));
					pre[key] = val;	
				}
				return pre;
			}, {});

		listeners.value = res;
	});

	return listeners;
};
