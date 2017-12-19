exports.bindEvent = (connection, event, callback) => {
	connection.events[event] = connection.events[event]
		? [...connection.events[event], callback]
		: [callback]
}

exports.unbindEvent = (connection, event, callback) => {
	const index = connection.events[event].indexOf(callback)
	connection.events[event].splice(index, 1)
}

exports.bindResponse = (connection, response, callback) => {
	connection.responses[response] = connection.responses[response]
		? [...connection.responses[response], callback]
		: [callback]
}
