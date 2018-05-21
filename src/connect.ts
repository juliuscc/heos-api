import net from 'net'
import { Client } from 'node-ssdp'
import { dataEventHandler } from './dataHandler'
import { HeosConnection } from './types'
import { DEFAULT_PORT } from './utils/constants'

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

export function connect(address: string) {
	return new Promise((resolve, reject) => {
		const host = address
		const port = DEFAULT_PORT

		try {
			const socket = net.connect(port, host)
			const connection: HeosConnection = {
				socket,
				events: {},
				responses: {}
			}

			socket.on('connect', () => {
				return resolve(connection)
			})

			socket.on('data', data => dataEventHandler(connection, data))

			socket.on('end', (error: Error) => {
				console.error(error)
			})

			socket.on('timeout', () => {
				reject()
				console.error(new Error('Timeout error when connecting to heos device'))
			})
		} catch (error) {
			reject(error)
		}
	})
}

export const discoverAndConnect = () =>
	discover().then((device: any) => connect(device.address))
