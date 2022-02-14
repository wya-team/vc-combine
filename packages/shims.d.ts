// 第三方不存在d.ts时，用于忽略
declare module '@wya/vc'
declare module '@wya/utils'
declare module '@wya/http'
declare module '@wya/ps'
declare module 'lodash'

declare module '*.vue' {
	import { defineComponent } from 'vue'; // eslint-disable-line

	const Component: ReturnType<typeof defineComponent>;
	export default Component;
	export const Popup: any;
}

declare module '@wya/vcc*' {
	import { defineComponent } from 'vue'; // eslint-disable-line

	const Component: ReturnType<typeof defineComponent>;
	export default Component;
}

