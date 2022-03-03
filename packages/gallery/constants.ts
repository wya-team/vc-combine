export const SOURCE_MAP = {
	'image': {
		name: '图片',
		fileType: 1,
		elementTag: 'img'
	},
	'video': {
		name: '视频',
		fileType: 2,
		elementTag: 'video'
	},
	'audio': {
		name: '音频',
		fileType: 3,
		elementTag: 'audio'
	}
};

export interface fieldMap {
	catId: string,
	catType: string,
	catName: string,
	// 与 filename, field 做区分
	fileName: string,
	fileId: string,
	fileUrl: string,
	fileSize: string,
	fileType: string,
	isDefault: string,
	count: string
}
// 默认的数据字段名映射
export const DEFAULT_FIELD_MAP: fieldMap = {
	catId: 'cat_id',
	catType: 'cat_type',
	catName: 'cat_name',
	// 与 filename, field 做区分
	fileName: 'file_name',
	fileId: 'file_id',
	fileUrl: 'file_url',
	fileSize: 'file_size',
	fileType: 'cat_type',
	isDefault: 'is_default',
	count: 'cat_num'
};

/**
 * 文件mime类型与文件扩展名的映射关系，如果后期还有其他的，在这边加就好了
 * https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
 * https://www.geek-share.com/detail/2732461148.html
 */
export const MIME_EXT_MAP = {
	// 图片
	'image/jpeg': ['.jpg', '.jpeg'],
	'image/png': ['.png'],
	'image/gif': ['.gif'],
	'image/tiff': ['.tiff', '.tif'],
	'image/bmp': ['.bmp'],
	'image/webp': ['.webp'],

	// 音频
	'audio/mp3': ['.mp3'],
	'audio/mpeg': ['.mp3'],
	'audio/m4a': ['.m4a'],
	'audio/aac': ['.aac'],
	'audio/webm': ['.weba'],
	'audio/midi': ['.midi', '.mid'],
	'audio/ogg': ['.oga'],
	'audio/mp4': ['.mp4a'],
	'audio/wav': ['.wav'],
	'audio/3gpp': ['.3gp'],
	'audio/3gpp2': ['.3g2'],
	'audio/x-ms-wma': ['.wma'],

	// 视频
	'video/mp4': ['.mp4'],
	'video/mpeg': ['.mpeg', '.mpg'],
	'video/quicktime': ['.mov'],
	'video/ogg': ['.ogv'],
	'video/webm': ['.webm'],
	'video/3gpp': ['.3gp'],
	'video/3gpp2': ['.3g2'],
	'video/x-msvideo': ['.avi'],
	'video/x-ms-wmv': ['.wm'],
	'video/x-flv': ['.flv'],
	'video/x-matroska': ['.mkv'],

};