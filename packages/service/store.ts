import { ref, onBeforeMount, onBeforeUnmount, getCurrentInstance } from 'vue';
import { isEqualWith } from 'lodash';
import { Storage } from '@wya/utils';
import Base from './base';

const defaultCompare = (newParam: any, localObj: any) => {
	return isEqualWith(newParam, localObj.param);
};

const getIndex = (newParam: any, store, compare: any) => {
	return store.findIndex(i => compare(newParam, i));
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
			parser = (v) => v,
			cache = false,
			param: defaultParam = {},
			getParam = () => ({}),
			dynamic = false
		} = defaultOptions;
		let store: any = [];

		if (cache) {
			const persistData = Storage.get(key);
			store = Array.isArray(persistData) ? persistData : [];
		}

		return (userOptions: Options = {}) => {
			const { globalProperties } = getCurrentInstance()?.appContext?.config || {};

			const { param: userParam = {} } = userOptions;
			const options = { ...defaultOptions, ...userOptions };
			const { 
				autoLoad = true, 
				autoClear = false, 
				alone = false,
				request = globalProperties?.$request 
			} = options;

			const responseData = ((store[getIndex(userParam, store, compare)] || {}).response || {}).data || [];
			const currentValue = ref(parser(responseData, userParam, store));
			const isLoading = ref(false);

			const loadData = async (param: any = {}, opts: Options = {}) => { // eslint-disable-line
				isLoading.value = true;
				param = {
					...defaultParam,
					...userParam,
					...param
				};

				try {
					let index = getIndex(param, store, compare);

					let store$ = store[index];
					if (!store$ && index === -1) {
						store$ = {
							param,
							response: undefined,
							promise: undefined
						};
						store.push(store$);
					}

					let { response, promise } = store$;
					promise = promise || request?.({
						url,
						localData: response,
						loading: false,
						param,
						dynamic,
						...opts,
						type: 'GET', // opts里面可能存在type, vc-select内
					});

					store$.param = param;
					store$.promise = promise;

					response = await promise;
					store$.response = response;
					
					currentValue.value = parser(response.data, param, store);
						
					if (cache) {
						let persistData = store.map(i => {
							return {
								param: i.param,
								response: i.response
							};
						});
						typeof cache === 'function'
							? cache(key, param, persistData)
							: (cache && Storage.set(key, persistData));
					}
					return response;
				} catch (response) {
					return Promise.reject(response);
				} finally {
					isLoading.value = false;
				}
			};

			const clearData = () => (store = []);

			!alone && autoLoad && onBeforeMount(async () => {
				const param$ = await getParam(this);
				loadData(param$);
			});

			!alone && autoClear && onBeforeUnmount(() => {
				clearData();
			});

			// 方法首字母大写
			const strFn = key.charAt(0).toUpperCase() + key.slice(1);

			!cache && this._add(clearData);
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
