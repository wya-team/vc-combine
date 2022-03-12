import { ref, computed, isRef } from 'vue';

export const useDataSource = (props) => {
	const _lazyData = ref([]);
	const isLoading = ref(false);

	const dataSource = computed(() => {
		return isRef(_lazyData.value) ? _lazyData.value.value : _lazyData.value;
	});

	const getDataSource = async (userDataSource) => {
		if (_lazyData.value.length) {
			return _lazyData;
		}

		if (typeof userDataSource === 'function') {
			// 支持返回promise、数组、或者ref（ref.value为数组数据）
			const res = userDataSource();
			if (res && res.then) {
				isLoading.value = true;
				_lazyData.value = await res;
				isLoading.value = false;
			} else {
				_lazyData.value = res;
			}
		} else {
			_lazyData.value = userDataSource;
		}
	};

	// 下拉选择框异步搜索
	const asyncSearch = async (keyword) => {
		if (typeof props.dataSource !== 'function') {
			throw new Error('搜索型下拉框组件的“dataSource”应为function');
		}
		_lazyData.value = await props.dataSource(keyword);
	};

	return {
		isLoading,
		dataSource,
		getDataSource,
		asyncSearch
	};
};