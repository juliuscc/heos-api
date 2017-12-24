const bindCallback = callbackType => (connection, event, callback) => {
	connection[callbackType] = connection[callbackType]
		? connection[callbackType]
		: {}

	const current = connection[callbackType][event]
	connection[callbackType][event] = current
		? [...current, callback]
		: [callback]
}

const unbindCallback = callbackType => (connection, event, callback) => {
	const current = connection[callbackType][event]

	connection[callbackType][event] = callback
		? current.filter(c => c !== callback)
		: []
}

const triggerCallback = callbackType => (connection, event, data) => {
	const callbacks = connection[callbackType][event] || []
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

exports.bindEvent = (connection, event, callback) =>
	bindCallback('events')(connection, event, callback)

exports.bindResponse = (connection, response, resolve, reject) =>
	bindCallback('responses')(connection, response, { resolve, reject })

exports.unbindEvent = (connection, event, callback) =>
	unbindCallback('events')(connection, event, callback)

exports.triggerEvent = (connection, event, data) =>
	triggerCallback('events')(connection, event, data)

exports.resolveOneResponse = (connection, response, data) =>
	useOneCallback('responses')('resolve')(connection, response, data)

exports.rejectOneResponse = (connection, response, data) =>
	useOneCallback('responses')('reject')(connection, response, data)
