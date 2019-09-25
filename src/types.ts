import { HeosEventEmitter } from './listen/responseEventHandler'

export type HeosCommandAttribute = {
	[key: string]: string | number
}

export type HeosCommand = {
	commandGroup: string
	command: string
	attributes?: HeosCommandAttribute
}

export type HeosResponseMessage =
	| {
			unparsed: string
			parsed?: {
				[key: string]: string | number
			}
	  }
	| {}

export type HeosEvent = {
	heos: {
		command: HeosCommand
		message: HeosResponseMessage
	}
}

export type HeosResponse = {
	heos: {
		command: HeosCommand
		result: string
		message: HeosResponseMessage
	}
	payload?: object | any[]
	options?: object
}

export interface HeosEventListener {
	(message: HeosResponse | HeosEvent): void
}
