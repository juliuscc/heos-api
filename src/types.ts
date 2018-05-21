import net from 'net'

export interface HeosConnection {
	socket: net.Socket
	events: any
	responses: any
}

export interface HeosResponse {
	heos: {
		command: string
		result: string
		message: string
	}
	payload?: object | any[]
	options?: object
}

export interface HeosResponseData {
	message?: {
		rawMessage
		message: string | {}
	}
	payload?: object
}
