const net = require('net')
const EventEmitter = require('events').EventEmitter
const { Client } = require('node-ssdp')
const { dataEventHandler } = require('./dataHandler')
const { DEFAULT_PORT } = require('./utils/constants')

class Device {
	constructor(headers, statusCode, rInfo) {
		this.address = rInfo.address
		this.statusCode = statusCode
	}
}

class Discoverer extends EventEmitter {
	constructor() {
		super()
		this.devices = []
	}

	addDevice(newDevice) {
		let device = this.devices.find(
			device => device.address === newDevice.address
		)

		if (typeof device === 'undefined') {
			this.devices.push(newDevice)
		} else if (device.statusCode !== 200 && newDevice.statusCode === 200) {
			device.statusCode = 200
		}
	}

	discover(timeout = 5000) {
		const client = new Client()

		client.on('response', (headers, statusCode, rInfo) => {
			let foundDevice = new Device(headers, statusCode, rInfo)
			this.addDevice(foundDevice)
			this.emit('discovery', foundDevice, this.devices)
		})

		client.on('error', err => {
			this.emit('error', err)
		})

		const searchTargetName = 'urn:schemas-denon-com:device:ACT-Denon:1'
		client.search(searchTargetName)

		return new Promise((resolve, reject) => {
			if (timeout <= 0) {
				setInterval(() => {}, timeout)
			} else {
				setTimeout(() => {
					client.stop()
					this.devices.size > 0 ? resolve() : reject()
				}, timeout)
			}
		})
	}
}

exports.Discoverer = Discoverer

const discover = callback =>
	new Promise((resolve, reject) => {
		let discoverer = new Discoverer()

		discoverer.on('discovery', callback)
		discoverer.discover()
	})

exports.discover = discover

const findAny = () =>
	new Promise((resolve, reject) => {
		discover((foundDevice, devices) => {
			resolve(foundDevice)
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
