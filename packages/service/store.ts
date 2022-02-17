import { ref, reactive, onBeforeMount, onBeforeUnmount, getCurrentInstance } from 'vue';
import { isEqualWith, cloneDeep } from 'lodash';
import { Storage } from '@wya/utils';
import Base from './base';

const resetStore = () => {
	return cloneDeep({
		param: {},
		response: undefined
	});
};

const defaultCompare = (newParam: any, localObj: any) => {
	return isEqualWith(newParam, localObj.param)
		? localObj.response
		: undefined;
};

class StoreService extends Base {
	constructor() {
		super();
		this.create = this.create.bind(this);
	}

	create(defaultOptions: Options = {}) {
		const {
			key,
			url,
			compare = defaultCompare,
			parser = null,
			cache = false,
			param: defaultParam = {},
			getParam = () => ({}),
		} = defaultOptions;
		let store: any;
		cache && (store = Storage.get(`${key}`));
		store = store || resetStore();

		// clear
		!cache && this._add(() => {
			store = resetStore();
		});
		return (userOptions: Options = {}) => {
			const { globalProperties } = getCurrentInstance()?.appContext?.config as any;
			const { param: userParam = {} } = userOptions;
			const options = { ...defaultOptions, ...userOptions };
			const { autoLoad = true, autoClear = false } = options;
			// 方法首字母大写
			const strFn = key.charAt(0).toUpperCase() + key.slice(1);
			
			const result = {};
			const loadKey = `load${strFn}`;
			const clearKey = `clear${strFn}`;
			const loadingKey = `loading${strFn}`;

			const responseData = (store.response || {}).data || [];
			result[key] = reactive(parser ? parser(responseData) : responseData);
			result[loadingKey] = ref(false);

			result[loadKey] = (param: any, opts: Options = {}) => { // eslint-disable-line
				result[loadingKey].value = true;
				return globalProperties?.$request?.({
					url, // 必须是mutationType
					localData: compare(param, store),
					loading: false,
					param,
					...opts,
					type: 'GET', // opts里面可能存在type, vc-select内
				}).then((response: any) => {
					store = {
						param,
						response
					};
					Object.assign(
						result[key], 
						parser ? parser(store.response.data) : store.response.data
					);
					typeof cache === 'function' 
						? cache(key, store) 
						: (cache && Storage.set(`${key}`, store));
					return response;
				}).catch((response: any) => {
					return Promise.reject(response);
				}).finally(() => {
					result[loadingKey].value = false;
				});
			};
			result[clearKey] = () => {
				store = resetStore();
			};

			onBeforeMount(() => {
				autoLoad && (result[loadKey])({
					...defaultParam,
					...userParam,
					...getParam(this)
				});
			});

			onBeforeUnmount(() => {
				autoClear && result[clearKey]();
			});

			return result;
		};
	}
}

export default new StoreService();