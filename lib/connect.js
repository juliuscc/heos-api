const net = require('net')
const { DEFAULT_PORT } = require('./utils/constants')

module.exports = device =>
	new Promise((resolve, reject) => {
		const host = device.address
		const port = DEFAULT_PORT

		const connection = net.connect(port, host)

		connection.on('connect', () => {
			console.log(`This is connection: ${connection}`)
			return resolve(connection)
		})

		connection.on('end', err => {
			console.error(err)
		})

		connection.on('timeout', err => {
			reject(err)
			console.error(err)
		})
	})
