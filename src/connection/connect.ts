import { createConnection, Socket } from 'net'
import { DEFAULT_PORT } from '../utils/constants'
import {
	ResponseEventHandler,
	HeosEventEmitter,
	HeosAllEventEmitter
} from '../listen/responseEventHandler'
import { ResponseParser } from '../listen/responseParser'
import { HeosConnection } from './heosConnection'
import { HeosResponse, HeosEvent } from '../types'

function createHeosSocket(address: string, responseParser: ResponseParser): Promise<Socket> {
	let hasResolvedOrRejected: boolean = false

	return new Promise((resolve, reject) => {
		const host: string = address
		const port: number = DEFAULT_PORT

		try {
			const socket: Socket = createConnection({ port, host, localPort: 0 }, () => {
				hasResolvedOrRejected = true
				resolve(socket)
			})

			socket.on('data', (data: string) => responseParser.put(data))
			socket.on('timeout', () => {
				if (!hasResolvedOrRejected) {
					socket.end()
					hasResolvedOrRejected = true
					reject(new Error('Socket timeout'))
				}
			})
			socket.on('error', error => {
				if (!hasResolvedOrRejected) {
					hasResolvedOrRejected = true
					reject(error)
				} else {
					console.error(error)
				}
			})
		} catch (error) {
			reject(error)
		}
	})
}

/**
 * Establishes a connection with a HEOS device. Use this function when you know the address of a HEOS device. It is recommended to use `hoes.discoverOneDevice()` to find an address.
 * @param address The address of the host (HEOS device) to create a connection to.
 * @returns A promise that resolves with a HeosConnection that can be used to communicate with a HEOS device.
 */
export function connect(address: string): Promise<HeosConnection> {
	return new Promise((resolve, reject) => {
		const responseEventHandler = new ResponseEventHandler()
		const responseParser = new ResponseParser((message: HeosResponse | HeosEvent) =>
			responseEventHandler.put(message)
		)

		createHeosSocket(address, responseParser)
			.then(socket => {
				const on: HeosEventEmitter = (event, listener) =>
					responseEventHandler.on(event, listener)

				const once: HeosEventEmitter = (event, listener) =>
					responseEventHandler.once(event, listener)

				const onAll: HeosAllEventEmitter = listener => responseEventHandler.onAll(listener)

				const connection = new HeosConnection(on, once, onAll, socket)

				resolve(connection)
			})
			.catch(reject)
	})
}
