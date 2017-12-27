const { dataEventHandler } = require('../lib/dataHandler')
const commands = require('../lib/commands/commands')

const mockConnect = write =>
	new Promise(resolve => {
		const connection = {
			connection: {
				write
			}
		}
		resolve(connection)
	})

describe('Integration test: The whole module works', () => {
	it('Tests test-environment', () => {
		expect.assertions(1)

		return mockConnect(jest.fn()).then(connection =>
			expect(connection).toBeDefined()
		)
	})

	it('Sends command')
})
