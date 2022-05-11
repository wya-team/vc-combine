import { Portal } from '@wya/vc';
import { ajax } from '@wya/http';
import wrapperComponent from './gallery.vue';
import { SOURCE_MAP } from './constants.js';

const Gallery = new Portal(wrapperComponent, {
	async onBefore(options) {
		// 兼容旧api
		options.request = options.request || options.ajax;
		options.uploadOptions = options.uploadOptions || options.uploadOpts;

		const { mode, valueKey, apis, ...rest } = options;
		const http = rest.request || ajax;

		const res = await http({
			url: apis['URL_GALLERY_CATEGORY_LIST'],
			type: 'GET',
			param: {
				// 分类类型：1 图片，2 视频
				[valueKey ? valueKey.catType : 'cat_type']: SOURCE_MAP[mode].fileType
			}
		});
		return res.data;
	}
});

export default Gallery;