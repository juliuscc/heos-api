import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import sourceMaps from 'rollup-plugin-sourcemaps'
import camelCase from 'lodash.camelcase'
import typescript from 'rollup-plugin-typescript2'
import json from 'rollup-plugin-json'
import builtins from 'rollup-plugin-node-builtins'

const pkg = require('./package.json')

const libraryName = 'heos-api'

export default {
	input: `src/${libraryName}.ts`,
	output: [
		{ file: pkg.main, name: camelCase(libraryName), format: 'umd', sourcemap: true },
		{ file: pkg.module, format: 'es', sourcemap: true }
	],
	// Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
	external: ['dgram', 'net'],
	watch: {
		include: 'src/**'
	},
	plugins: [
		// Allow json resolution
		json(),

		// Compile TypeScript files
		typescript({ useTsconfigDeclarationDir: true }),

		// Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
		commonjs(),

		// Allows the node builtins to be required/imported
		builtins(),

		// Allow node_modules resolution, so you can use 'external' to control
		// which external modules to include in the bundle
		// https://github.com/rollup/rollup-plugin-node-resolve#usage
		resolve(),

		// Resolve source maps to the original source
		sourceMaps()
	]
}
