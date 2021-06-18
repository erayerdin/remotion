import fs from 'fs';
import path from 'path';
import {tmpDir} from '../shared/tmpdir';
import esbuild = require('esbuild');
import zl = require('zip-lib');

export const bundleLambda = async (type: 'render') => {
	const outdir = path.join(__dirname, '..', `build-${type}`);
	fs.mkdirSync(outdir, {
		recursive: true,
	});
	const outfile = path.join(outdir, 'index.js');

	(fs.rmSync ?? fs.rmdirSync)(outdir, {recursive: true});
	fs.mkdirSync(outdir, {recursive: true});
	const template = require.resolve(
		path.join(__dirname, '..', 'functions', 'index')
	);

	await esbuild.build({
		platform: 'node',
		target: 'node12',
		bundle: true,
		outfile,
		entryPoints: [template],
	});

	const out = path.join(tmpDir('remotion-fn'), `function-${type}.zip`);
	await zl.archiveFolder(outdir, out);
	return out;
};
