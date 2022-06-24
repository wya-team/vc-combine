import type { Ref } from 'vue';
import { ref, computed, isRef } from 'vue';
import type {
	SelectDataSource,
	CascaderDataSource,
	CascaderLabelValueItem,
	LabelValueItem
} from '../filter-types';

type UserAsyncDataSource<
	T extends SelectDataSource | CascaderDataSource
> = T extends (keywords?: string) => Promise<any> ? T : never

type DataSource<
	T extends SelectDataSource | CascaderDataSource
> = T extends SelectDataSource ? LabelValueItem[] : CascaderLabelValueItem[]

type LazyData<T extends SelectDataSource | CascaderDataSource> = Ref<DataSource<T>>

export const useDataSource = <T extends SelectDataSource | CascaderDataSource>(userDataSource: T) => {
	const _lazyData: LazyData<T> | Ref<LazyData<T>> = ref([]);
	const isLoading = ref(false);

	const dataSource = computed(() => {
		return isRef(_lazyData.value)
			? (_lazyData.value as LazyData<T>).value
			: (_lazyData as LazyData<T>).value;
	});

	const getDataSource = async () => {
		if (dataSource.value.length) {
			return dataSource.value;
		}

		if (typeof userDataSource === 'function') {
			// 支持返回promise、数组、或者ref（ref.value为数组数据）
			const res = userDataSource();
			if (res && (res as ReturnType<UserAsyncDataSource<T>>).then) {
				isLoading.value = true;
				(_lazyData.value as DataSource<T> | Ref<DataSource<T>>) = (await res) as DataSource<T> | Ref<DataSource<T>>;
				isLoading.value = false;
			} else {
				_lazyData.value = res as DataSource<T>;
			}
		} else {
			_lazyData.value = userDataSource as DataSource<T>;
		}
	};

	// 下拉选择框异步搜索
	const asyncSearch = async (keyword) => {
		if (typeof userDataSource !== 'function') {
			throw new Error('搜索型下拉框组件的“dataSource”应为function');
		}
		(_lazyData as LazyData<SelectDataSource> | Ref<LazyData<SelectDataSource>>).value = await (
			userDataSource(keyword) as ReturnType<UserAsyncDataSource<SelectDataSource>>
		);
	};

	return {
		isLoading,
		dataSource,
		getDataSource,
		asyncSearch
	};
};
