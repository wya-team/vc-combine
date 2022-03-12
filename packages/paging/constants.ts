import type { InjectionKey } from "vue";

export const INT_MIN = 0;
// 整型数值输入框最大值默认值：10位数字
export const INT_MAX = 9999999999;
export const FLOAT_MIN = 0;
// 浮点数值输入框最大值默认值：8位整数，2位小数
export const FLOAT_MAX = 99999999.99;
export const AMOUNT_MIN = FLOAT_MIN;
export const AMOUNT_MAX = FLOAT_MAX;

export const FILTER_KEY: InjectionKey<string> = Symbol('filter');
