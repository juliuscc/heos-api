import { createConnection, Socket } from 'net'
import { DEFAULT_PORT } from '../utils/constants'
import { ResponseEventHandler } from '../listen/responseEventHandler'
import { ResponseParser } from '../listen/responseParser'
import { HeosConnection, HeosCommandAttribute } from '../types'
import { generateHeosCommand } from '../write/heosCommand'

type HeosSocket = {
	write: Socket['write']
}

function createHeosSocket(address: string, onData: (data: string) => void): Promise<HeosSocket> {
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

export function connect(address: string): Promise<HeosConnection> {
	return new Promise((resolve, reject) => {
		const responseEventHandler = new ResponseEventHandler()
		const responseParser = new ResponseParser(responseEventHandler.put)

		createHeosSocket(address, responseParser.put)
			.then(socket => {
				const write = (
					commandGroup: string,
					command: string,
					attributes?: HeosCommandAttribute
				) => socket.write(generateHeosCommand(commandGroup, command, attributes))

				return {
					write,
					on: responseEventHandler.on,
					once: responseEventHandler.once
				}
			})
			.catch(reject)
	})
}
