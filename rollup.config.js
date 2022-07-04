import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import metablock from 'rollup-plugin-userscript-metablock';
import nodeResolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import typescriptPlugin from '@rollup/plugin-typescript';
import typescript from 'typescript';

const fs = require('fs');
const pkg = require('./package.json');

fs.mkdir('dist/', {recursive: true}, () => null);

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/bundle.user.js',
    format: 'iife',
    name: 'rollupUserScript',
    banner: () => (fs.existsSync('./LICENSE') ? '\n/*\n' + fs.readFileSync('./LICENSE', 'utf8') + '*/\n' : ''),
    sourcemap: true,
  },
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
      ENVIRONMENT: JSON.stringify('production'),
      preventAssignment: true,
    }),
    nodeResolve({extensions: ['.js', '.ts']}),
    json(),
    typescriptPlugin({typescript}),
    commonjs({
      include: ['node_modules/**'],
      exclude: ['node_modules/process-es6/**'],
    }),
    babel({babelHelpers: 'bundled'}),
    metablock({
      file: './meta.js',
      override: {
        version: pkg.version,
        description: pkg.description,
        homepage: pkg.homepage,
        author: pkg.author,
        license: pkg.license,
      },
    }),
  ],
};
