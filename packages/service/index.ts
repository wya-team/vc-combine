import Base from './base';
import Store from './store';

export default {
	createStore: Store.create,
	clear: (new Base()).clear
};