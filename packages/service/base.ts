const cbs: any[] = [];

class Base {
	_cbs: any[];

	constructor() {
		this._cbs = cbs;
	}

	_add = (cb: any) => {
		this._cbs.push(cb);
	}

	clear = () => {
		this._cbs.forEach(cb => cb());
		this._cbs = [];
	}
}

export default Base;