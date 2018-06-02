const net = require('net')
const EventEmitter = require('events').EventEmitter
const { Client } = require('node-ssdp')
const { dataEventHandler } = require('./dataHandler')
const { DEFAULT_PORT } = require('./utils/constants')

class Discoverer extends EventEmitter {
	constructor() {
		super()
		this.devices = []

		this.client = new Client()

		const createDevice = (headers, statusCode, rInfo) => ({
			address: rInfo.address,
			statusCode
		})

		this.client.on('response', (headers, statusCode, rInfo) => {
			const foundDevice = createDevice(headers, statusCode, rInfo)
			this.addDevice(foundDevice)
			this.emit('discovery', foundDevice, this.devices)
		})

		this.client.on('error', err => {
			this.emit('error', err)
		})
	}

	addDevice(newDevice) {
		const device = this.devices.find(
			device => device.address === newDevice.address
		)

		if (!device) {
			this.devices.push(newDevice)
		} else if (device.statusCode !== 200 && newDevice.statusCode === 200) {
			device.statusCode = 200
		}
	}

	discover(timeout = 5000) {
		const searchTargetName = 'urn:schemas-denon-com:device:ACT-Denon:1'
		this.client.search(searchTargetName)

		return new Promise((resolve, reject) => {
			if (timeout <= 0) {
				setInterval(() => {}, 1000000000)
			} else {
				setTimeout(() => {
					this.stop() ? resolve() : reject(noDeviceFoundError())
				}, timeout)
			}
		})
	}

	stop() {
		this.client.stop()
		return this.devices.length > 0
	}
}

exports.Discoverer = Discoverer

const noDeviceFoundError = () => {
  return new Error('No devices found')
}

const discover = callback => {
	const discoverer = new Discoverer()

	discoverer.on('discovery', callback.bind(discoverer))
	return discoverer.discover()
}

exports.discover = discover

const findAny = () =>
	new Promise((resolve, reject) => {
		discover(function(foundDevice, devices) {
			this.stop() ? resolve(foundDevice) : reject(noDeviceFoundError())
		})
	})

exports.findAny = findAny

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
	findAny().then(device => connect(device.address))
