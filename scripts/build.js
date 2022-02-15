const path = require('path');
const fs = require('fs-extra');

const typescript = require('rollup-plugin-typescript2');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const replace = require('@rollup/plugin-replace');
const vuePlugin = require('rollup-plugin-vue');

// const util = require('util');
// const exec = util.promisify(require('child_process').exec);
const { rollup: rollupBuilder } = require('rollup');

class Builder {
	constructor(config) {
		this.config = config;
	}

	async process() {
		let { input, output } = this.config;
		try {
			const builder = await rollupBuilder({
				input,
				external: [
					'@wya/vc', 
					'@wya/http', 
					'@wya/utils', 
					'vue',
					'lodash',
					/^@wya\/vcc-/
				],
				plugins: [
					vuePlugin(),
					typescript({
						include: [/\.tsx?$/, /\.vue\?.*?lang(\.|=)ts$/],
					}),
					commonjs({ extensions: ['.js', '.ts'] }),
					nodeResolve(),
					replace({
						 preventAssignment: true
					})
				]
			});
			await builder.write({ output });
			console.log('Success!');
		} catch (e) {
			console.log('Error!', e);
			throw e;
		}
	}
}

const directory = path.resolve(__dirname, '../packages/');
fs.readdirSync(directory).reduce((preProcess, file) => {
	const fullpath = path.resolve(directory, file);
	// 获取文件信息
	const stat = fs.statSync(fullpath);
	if (!(/(^_)/.test(file)) && stat.isDirectory()) {
		return preProcess.then(() => {
			const builder = new Builder({
				input: fullpath + '/index.ts',
				output: {
					file: fullpath + '/dist/index.js',
					format: 'cjs',
					exports: 'named'
				} 
			});
			return builder.process();
		});
	} else {
		return preProcess;
	}
}, Promise.resolve());

// Config.getAllBuilds().forEach(item => new Builder(item).process());
