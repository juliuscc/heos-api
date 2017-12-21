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

// TODO do:
const triggerCallback = callbackType => (connection, event, callback) => {}

const triggerAllCallbacks = callbackType => (connection, event, callback) => {}

const useCallback = callbackType => (connection, event, callback) => {}

const useAllCallbacks = callbackType => (connection, event, callback) => {}
// TODO end

exports.bindEvent = (connection, event, callback) =>
	bindCallback('events')(connection, event, callback)

exports.bindResponse = (connection, response, callback) =>
	bindCallback('responses')(connection, response, callback)

exports.unbindEvent = (connection, event, callback) =>
	unbindCallback('events')(connection, event, callback)

exports.useResponse = (connection, response, callback) =>
	useCallback('responses')(connection, response, callback)
