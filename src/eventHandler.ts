import { HeosConnection, HeosResponseData } from './types'

const bindCallback = callbackType => (
	connection: HeosConnection,
	event,
	callback
) => {
	connection[callbackType] = connection[callbackType]
		? connection[callbackType]
		: {}

	const current = connection[callbackType][event]
	connection[callbackType][event] = current
		? [...current, callback]
		: [callback]
}

const unbindCallback = callbackType => (
	connection: HeosConnection,
	event,
	callback
) => {
	const current = connection[callbackType][event]

	connection[callbackType][event] = callback
		? current.filter(c => c !== callback)
		: []
}

const triggerCallback = (callbackType: string) => (
	connection: HeosConnection,
	event: string,
	data: HeosResponseData
) => {
	const callbacks: Function[] = connection[callbackType][event] || []
	const unique = [...new Set(callbacks)]

	unique.forEach(c => c(data))
}

const useOneCallback = callbackType => resolve_reject => (
	connection,
	event,
	data
) => {
	if (
		!connection[callbackType] ||
		!connection[callbackType][event] ||
		connection[callbackType][event].length === 0
	) {
		throw new Error('Unexpected response received')
	}

	const [firstCallback, ...rest] = connection[callbackType][event]
	connection[callbackType][event] = rest
	firstCallback[resolve_reject](data)
}

export const bindEvent = (connection: HeosConnection, event, callback) =>
	bindCallback('events')(connection, event, callback)

export const bindResponse = (
	connection: HeosConnection,
	response,
	resolve,
	reject
) => bindCallback('responses')(connection, response, { resolve, reject })

export const unbindEvent = (connection: HeosConnection, event, callback) =>
	unbindCallback('events')(connection, event, callback)

export const triggerEvent = (connection: HeosConnection, event, data) =>
	triggerCallback('events')(connection, event, data)

export const resolveOneResponse = (
	connection: HeosConnection,
	response,
	data
) => useOneCallback('responses')('resolve')(connection, response, data)

export const rejectOneResponse = (connection: HeosConnection, response, data) =>
	useOneCallback('responses')('reject')(connection, response, data)
