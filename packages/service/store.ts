import { ref, onBeforeMount, onBeforeUnmount, getCurrentInstance } from 'vue';
import { isEqualWith, cloneDeep } from 'lodash';
import { Storage } from '@wya/utils';
import Base from './base';

const resetStore = () => {
	return cloneDeep({
		param: {},
		promise: undefined,
		response: undefined
	});
};

const defaultCompare = (newParam: any, localObj: any) => {
	return isEqualWith(newParam, localObj.param)
		? localObj
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
			dynamic = false,
			onAfter
		} = defaultOptions;
		let store: any;
		cache && (store = Storage.get(`${key}`));
		store = store || resetStore();

		// clear
		const clearFn = () => {
			store = resetStore();
		};
		return (userOptions: Options = {}) => {
			!cache && this._add(clearFn);
			const { globalProperties } = getCurrentInstance()?.appContext?.config as any;
			const { param: userParam = {} } = userOptions;
			const options = { ...defaultOptions, ...userOptions };
			const { autoLoad = true, autoClear = false } = options;

			const responseData = (store.response || {}).data || [];
			const currentValue = ref(parser ? parser(responseData) : responseData);
			const isLoading = ref(false);

			const loadData = async (param: any = {}, opts: Options = {}) => { // eslint-disable-line
				isLoading.value = true;
				param = {
					...defaultParam,
					...userParam,
					...param
				};

				try {
					let { promise, response } = compare(param, store) || {};

					promise = promise || globalProperties?.$request?.({
						url,
						localData: response,
						loading: false,
						param,
						dynamic,
						onAfter,
						...opts,
						type: 'GET', // opts里面可能存在type, vc-select内
					});

					store.param = param;
					store.promise = promise;

					response = await promise;
					store.response = response;

					currentValue.value = parser ? parser(store.response.data) : store.response.data;
					typeof cache === 'function'
						? cache(key, store)
						: (cache && Storage.set(`${key}`, store));
					return response;
				} catch (response) {
					return Promise.reject(response);
				} finally {
					isLoading.value = false;
				}
			};

			const clearData = () => {
				store = resetStore();
			};

			onBeforeMount(() => {
				autoLoad && loadData({
					...defaultParam,
					...userParam,
					...getParam(this)
				});
			});

			onBeforeUnmount(() => {
				autoClear && clearData();
			});

			// 方法首字母大写
			const strFn = key.charAt(0).toUpperCase() + key.slice(1);

			return {
				[key]: currentValue,
				[`loading${strFn}`]: isLoading,
				[`load${strFn}`]: loadData,
				[`clear${strFn}`]: clearData
			};
		};
	}
}

export default new StoreService();
