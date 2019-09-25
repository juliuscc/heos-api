import {
	DEFAULT_PORT,
	FIRST_LEVEL_HEOS_RESPONSE_MESSAGE_SPLITTER,
	SECOND_LEVEL_HEOS_RESPONSE_MESSAGE_SPLITTER
} from '../../src/utils/constants'

describe('Snapshot tests of constants', () => {
	it('Default port is not changed', () => {
		expect(DEFAULT_PORT).toMatchSnapshot()
	})

	it('First level HEOS response message splitter is not changed', () => {
		expect(FIRST_LEVEL_HEOS_RESPONSE_MESSAGE_SPLITTER).toMatchSnapshot()
	})

	it('Second level HEOS response message splitter is not changed', () => {
		expect(SECOND_LEVEL_HEOS_RESPONSE_MESSAGE_SPLITTER).toMatchSnapshot()
	})
})
