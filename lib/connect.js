const net = require('net')
const dataEventHandler = require('./dataHandler')
const { DEFAULT_PORT } = require('./utils/constants')

module.exports = device =>
	new Promise((resolve, reject) => {
		const host = device.address
		const port = DEFAULT_PORT

		try {
			const connection = net.connect(port, host)

			connection.events = {}
			connection.responses = {}

			connection.on('connect', () => {
				return resolve(connection)
			})

			connection.on('data', data => dataEventHandler(data, connection))

			connection.on('end', error => {
				console.error(error)
			})

			connection.on('timeout', error => {
				reject(error)
				console.error(error)
			})
		} catch (error) {
			reject(error)
		}
	})
