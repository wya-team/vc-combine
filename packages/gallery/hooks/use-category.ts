import { ref, computed } from 'vue';
import { Modal } from '@wya/vc';
import { useConfig } from './use-config';
import { Editor } from '../popup';

export const useCategory = (refreshFiles) => {
	const { valueKey, apis, http, SOURCE_MAP, mode } = useConfig();

	const categories = ref([]);
	const activeCategory = ref();
	const activeCategoryId = computed(() => activeCategory.value?.[valueKey.catId]);

	const warningModal = ({ content }) => {
		return new Promise((resolve, reject) => {
			Modal.warning({
				content,
				onOk: resolve,
				onCancel: reject
			});
		});
	};
	
	const loadCategories = async () => {
		const { catType } = valueKey;
		const { data } = await http({
			url: apis['URL_GALLERY_CATEGORY_LIST'],
			type: 'GET',
			param: {
				[catType]: SOURCE_MAP[mode].fileType,
			}
		});
		categories.value = data;
		return data;
	};

	const setActiveCategory = (id) => {
		console.log(id, activeCategoryId.value, 'activeCategoryId.value');
		if (id === activeCategoryId.value) return;

		const { catId } = valueKey;
		const target = categories.value.find(it => it[catId] === id);
		activeCategory.value = target;
		refreshFiles(1);
	};

	const createCategory = (callback) => {
		const { catName, catType } = valueKey;
		Editor.popup({
			title: '新增分组',
			originalText: '分组',
			placeholder: '请输入分组名称',
			maxlength: 10
		}).then(async ({ inputValue }) => {
			await http({
				url: apis['URL_GALLERY_CATEGORY_ADD'],
				type: 'POST',
				param: {
					[catType]: SOURCE_MAP[mode].fileType,
					[catName]: inputValue
				}
			});
			callback && callback();
		});
	};

	const renameCategory = (target) => {
		const { catName, catId, catType } = valueKey;
		Editor.popup({
			title: '重命名分组',
			originalText: target[catName],
			placeholder: '新建分组',
			maxlength: 10
		})
			.then(({ inputValue }) => {
				http({
					url: apis['URL_GALLERY_CATEGORY_RENAME'],
					type: 'POST',
					param: {
						[catId]: target[catId],
						[catType]: SOURCE_MAP[mode].fileType,
						[catName]: inputValue
					}
				}).then(() => {
					target[catName] = inputValue;
				}).catch(err => {
					console.log(err, 'error');
				});
			});
	};

	const deleteCategory = async (target) => {
		const { catName, catId } = valueKey;
		const id = target[catId];
		await warningModal({ content: `您确定要删除分组"${target[catName]}"吗？` });
		await http({
			url: apis['URL_GALLERY_CATEGORY_DELETE'],
			type: 'POST',
			param: {
				[catId]: id
			}
		});
		categories.value = categories.value.filter(it => it[catId] !== id); 
		// 如果删除的是当前激活的分类，则回到第一个分类
		if (id === activeCategoryId.value) {
			setActiveCategory(categories.value[0][catId]);
		}
		return id;
	};

	return {
		categories,
		activeCategory,
		activeCategoryId,

		loadCategories,
		setActiveCategory,
		createCategory,
		renameCategory,
		deleteCategory
	};
};