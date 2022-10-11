import Service from '../../index';

export const useMemoryData = Service.createStore({
	key: "memoryData",
	url: `${location.origin}?memory`,
	parser: (data) => {
		return data;
	}
});


export const useCacheData = Service.createStore({
	key: "cacheData",
	cache: true,
	url: `${location.origin}?cache`,
	parser: (data) => {
		return data;
	}
});