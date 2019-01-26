import { createConnection, Socket } from 'net'
import { DEFAULT_PORT } from '../utils/constants'
import { ResponseEventHandler, HeosEventEmitter } from '../listen/responseEventHandler'
import { ResponseParser } from '../listen/responseParser'
import { HeosConnection } from './heosConnection'

type HeosSocket = {
	write: Socket['write']
}

function createHeosSocket(address: string, responseParser: ResponseParser): Promise<HeosSocket> {
	return new Promise((resolve, reject) => {
		const host: string = address
		const port: number = DEFAULT_PORT

		try {
			const socket: Socket = createConnection(port, host)

			socket.on('data', (data: string) => responseParser.put(data))

			socket.on('timeout', reject)

			socket.write(`heos://system/register_for_change_events?enable='on'\r\n`)

			resolve({ write: socket.write })
		} catch (error) {
			reject(error)
		}
	})
}

export function connect(address: string): Promise<HeosConnection> {
	return new Promise((resolve, reject) => {
		const responseEventHandler = new ResponseEventHandler()
		const responseParser = new ResponseParser(responseEventHandler.put)

		createHeosSocket(address, responseParser)
			.then(socket => {
				const on: HeosEventEmitter = (event, listener) =>
					responseEventHandler.on(event, listener)

				const once: HeosEventEmitter = (event, listener) =>
					responseEventHandler.once(event, listener)

				const connection = new HeosConnection(on, once, (message: string) =>
					socket.write(message)
				)

				resolve(connection)
			})
			.catch(reject)
	})
}
