import { createConnection, Socket } from 'net'
import { DEFAULT_PORT } from './utils/constants'

export type Connection = {}

function connect(address: string): Promise<Connection> {
	return new Promise((resolve, reject) => {
		const host: string = address
		const port: number = DEFAULT_PORT

		const socket: Socket = createConnection(port, host)
	})
}
