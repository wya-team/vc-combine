import type { App } from 'vue';
import * as components from './components';

const install = (app: App, _options: Options): void => {
	Object.keys(components).forEach(c => {
		app.component(components[c].name, components[c]);
	});
};

export default {
	install
};
