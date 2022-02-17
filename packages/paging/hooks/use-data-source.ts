import { ref } from 'vue';

export const useDataSource = (props) => {
	const dataSource = ref([]);
	const isLoading = ref(false);

	const getDataSource = async (userDataSource) => {
		if (dataSource.value.length) {
			return dataSource;
		}

		if (typeof userDataSource === 'function') {
			const res = userDataSource();
			if (res && res.then) {
				isLoading.value = true;
				dataSource.value = await res;
				isLoading.value = false;
			} else {
				dataSource.value = res;
			}
		} else {
			dataSource.value = userDataSource;
		}
	};

	// 下拉选择框异步搜索
	const asyncSearch = async (keyword) => {
		if (typeof props.dataSource !== 'function') {
			throw new Error('搜索型下拉框组件的“dataSource”应为function');
		}
		dataSource.value = await props.dataSource(keyword);
	};

	return {
		isLoading,
		dataSource,
		getDataSource,
		asyncSearch
	};
};