import Service from '../../index';

export const useMemoryData = Service.createStore({
	key: "memoryData",
	url: `${location.origin}?memory`,
	onAfter: () => {
		return {
			status: 1,
			data: {
				time: new Date().getTime()
			}
		};
	},
	parser: (data) => {
		return data;
	}
});


export const useCacheData = Service.createStore({
	key: "cacheData",
	cache: true,
	url: `${location.origin}?cache`,
	onAfter: () => {
		return {
			status: 1,
			data: {
				time: new Date().getTime()
			}
		};
	},
	parser: (data) => {
		return data;
	}
});