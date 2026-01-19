import type { App } from 'vue';
import * as Components from './components';

const install = (app: App, _options: Options): void => {
	Object.keys(Components).forEach(c => {
		app.component(Components[c].name, Components[c]);
	});
};

export * from './assist';
export * from './components';
export { install, Components };
export default {
	install
};
