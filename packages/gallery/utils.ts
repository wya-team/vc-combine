import { MIME_EXT_MAP } from './constants';

/**
 * 通过文件mime type 解析得到 人类可读的文件后缀
 * 如  image/jpeg,image/png,image/gif,image/bmp -> ['.jpg', '.jpeg', '.png', '.gif', '.bmp']
 *
 * @param {*} mimeStr 如 image/jpeg,image/png,image/gif,image/bmp
 * @param {*} mainMime 主mime 如image、video、audio
 * @returns {Array} 文件后缀数组
 */
export const getExtsByMimeStr = (mimeStr, mainMime) => {
	let mimes = mimeStr.split(',');
	// 如果传入mainMime，则将不属于主mime的mime类型过滤掉
	mimes = mainMime ? mimes.filter(it => it.includes(mainMime)) : mimes;
	
	return mimes.reduce((list, cur) => {
		const exts = /\/\*$/.test(cur) ? ['*'] : MIME_EXT_MAP[cur];
		return exts ? list.concat(exts) : list;
	}, []);
};

/**
 * 通过文件的src上的文件后缀名判断某个文件是否为合法（与允许上传的mime保持一致）文件后缀
 * 注意 * 的情况
 *
 * @param {string} src 文件src
 * @param {Array} mimeTypes 合法的文件后缀
 * @returns {boolean} 是否合法
 */
export const isValidMime = (src: string, mimeTypes: Array<string>): boolean => {
	if (mimeTypes.includes('*')) return true;
	const mime = src.replace(/.+(\.[\w\d]+)/, '$1').toLowerCase();
	return mimeTypes.includes(mime);
};

export const paddingZero = (v) => (v < 10 ? `0${v}` : `${v}`);
