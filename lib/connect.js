const net = require('net')
const { Client } = require('node-ssdp')
const { dataEventHandler } = require('./dataHandler')
const { DEFAULT_PORT } = require('./utils/constants')

const discover = () =>
	new Promise((resolve, reject) => {
		const client = new Client()

		client.on('response', (headers, statusCode, rinfo) => resolve(rinfo))

		client.on('error', err => {
			client.close()
			reject(err)
		})

		const searchTargetName = 'urn:schemas-denon-com:device:ACT-Denon:1'
		client.search(searchTargetName)
	})

const connect = device =>
	new Promise((resolve, reject) => {
		const host = device.address
		const port = DEFAULT_PORT

		try {
			const connection = net.connect(port, host)

			connection.events = {}
			connection.responses = {}

			connection.on('connect', () => {
				return resolve({ connection })
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

module.exports = () => discover().then(device => connect(device))
