// exports.unbindEvent = (connection, event, callback) => {
// 	const index = connection.events[event].indexOf(callback)
// 	index !== -1
// 		? connection.events[event].splice(index, 1)
// 		: (connection.events[event] = [])
// }

const bindCallbacks = callbackType => (connection, event, callback) => {
	const current = connection[callbackType][event]
	connection[callbackType][event] = current
		? [...current, callback]
		: [callback]
}

exports.bindEvent = (connection, event, callback) =>
	bindCallbacks('events')(connection, event, callback)

exports.bindResponse = (connection, response, callback) =>
	bindCallbacks('responses')(connection, response, callback)
