// Hack to keep process alive
setInterval(() => {}, 1000000000)
// Hack end

const util = require('util')

const api = require('./index')

function test1() {
	console.log('test1')
}

function test2() {
	console.log('test2')
}

api.getConnection().then(connection => {
	api.bindEvent(connection, 'test', test1)
	console.log(connection.events)
	api.unbindEvent(connection, 'test', test1)
	api.bindEvent(connection, 'test', test2)
	console.log(connection.events)
})
