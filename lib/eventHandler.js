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

const useOneCallback = callbackType => (connection, event, data) => {
	if (
		!connection[callbackType] ||
		!connection[callbackType][event] ||
		connection[callbackType][event].length === 0
	) {
		throw new Error('Unexpected response received')
	}

	const [firstCallback, ...rest] = connection[callbackType][event]
	connection[callbackType][event] = rest
	firstCallback(data)
}

exports.bindEvent = (connection, event, callback) =>
	bindCallback('events')(connection, event, callback)

exports.bindResponse = (connection, response, callback) =>
	bindCallback('responses')(connection, response, callback)

exports.unbindEvent = (connection, event, callback) =>
	unbindCallback('events')(connection, event, callback)

exports.triggerEvent = (connection, event, data) =>
	triggerCallback('events')(connection, event, data)

exports.useOneResponse = (connection, response, data) =>
	useOneCallback('responses')(connection, response, data)
