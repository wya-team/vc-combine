import type { App } from 'vue';
import * as components from './components';

const install = (app: App, _options: Options): void => {
	Object.keys(components).forEach(c => {
		app.use(components[c]);
	});
};

export default {
	install
};
