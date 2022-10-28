import type { Ref, ComponentInternalInstance } from 'vue';
import { ref, watch, computed, getCurrentInstance, isRef } from 'vue';
import type {
	SelectDataSource,
	CascaderDataSource
} from '../filter-types';

type DataSource= SelectDataSource | CascaderDataSource;

export const useDataSource = () => {
	const instance = getCurrentInstance() as ComponentInternalInstance;
	const { props } = instance;
	const currentValue: Ref<DataSource> = ref([]);
	const dataSource = computed(() => {
		return isRef(currentValue.value) 
			? currentValue.value.value
			: currentValue.value;
	});
	const isLoading = ref(false);

	const setDataSource = async () => {
		if (currentValue.value.length) {
			return currentValue.value;
		}

		if (typeof props.dataSource === 'function') {
			// 支持返回promise、数组、或者ref（ref.value为数组数据）
			const res = props.dataSource();
			if (res && res.then) {
				isLoading.value = true;
				currentValue.value = await res;
				isLoading.value = false;
			} else {
				currentValue.value = res as DataSource;
			}
		} else {
			currentValue.value = props.dataSource as DataSource;
		}
	};

	// 下拉选择框异步搜索
	const asyncSearch = async (keyword: any) => {
		if (typeof props.dataSource !== 'function') {
			throw new Error('搜索型下拉框组件的“dataSource”应为function');
		}
		currentValue.value = await props.dataSource(keyword);
	};

	watch(
		() => props.dataSource,
		() => setDataSource()
	);

	return {
		isLoading,
		dataSource,
		setDataSource,
		asyncSearch
	};
};
