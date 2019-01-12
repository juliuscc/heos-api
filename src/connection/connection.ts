import { createConnection, Socket } from 'net'
import { EventEmitter } from 'events'
import { DEFAULT_PORT } from '../utils/constants'
// import { ResponseParser } from '../listen/responseParser'
// import { HeosResponse } from '../types'

type HeosSocket = {
	write: Socket['write']
}

export type HeosConnection = {
	write: Socket['write']
	on: EventEmitter['on']
	once: EventEmitter['once']
}

// @ts-ignore
function createHeosSocket(
	address: string,
	onData: (data: string) => void
): Promise<HeosSocket> {
	return new Promise((resolve, reject) => {
		const host: string = address
		const port: number = DEFAULT_PORT

		try {
			const socket: Socket = createConnection(port, host)

			socket.on('data', onData)

			socket.on('timeout', reject)

			resolve({ write: socket.write })
		} catch (error) {
			reject(error)
		}
	})
}

// export function connect(address: string): Promise<HeosConnection> {
// 	return new Promise((resolve, reject) => {
// 		const onEvent = (message: HeosResponse) => {
// 			console.log(message)
// 		}

// 		const responseParser = new ResponseParser(onEvent)

// 		createHeosSocket(address, responseParser.put)
// 			.then(resolve)
// 			.catch(reject)
// 	})
// }
