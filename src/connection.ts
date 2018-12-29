import { createConnection, Socket } from 'net'
import { DEFAULT_PORT } from './utils/constants'

export type HeosSocket = {
	write: Socket['write']
}

export function connect(
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
