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

const connect = address =>
	new Promise((resolve, reject) => {
		const host = address
		const port = DEFAULT_PORT

		try {
			const connection = net.connect(port, host)

			connection.events = {}
			connection.responses = {}

			const returnVal = { connection }

			connection.on('connect', () => {
				return resolve(returnVal)
			})

			connection.on('data', data => dataEventHandler(returnVal, data))

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

exports.connect = connect

exports.discoverAndConnect = () =>
	discover().then(device => connect(device.address))
