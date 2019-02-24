import { DEFAULT_PORT } from '../../src/utils/constants'

describe('Snapshot tests of constants', () => {
	it('Default port is not changed', () => {
		expect(DEFAULT_PORT).toMatchSnapshot()
	})
})
