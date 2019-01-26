module.exports = {
	transform: {
		'.(ts|tsx)': 'ts-jest'
	},
	testEnvironment: 'node',
	testRegex: '(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$',
	moduleFileExtensions: ['ts', 'tsx', 'js'],
	coveragePathIgnorePatterns: ['/node_modules/', '/test/'],
	coverageThreshold: {
		global: {
			branches: 70,
			functions: 75,
			lines: 75,
			statements: 75
		}
	},
	collectCoverageFrom: ['src/*/**.{js,ts}']
}
