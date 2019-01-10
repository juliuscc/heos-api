// const { discoverOneDevice } = require('./lib/discover')
// const { connect } = require('./lib/connection')

// discoverOneDevice(3000)
// 	.then(address =>
// 		connect(
// 			address,
// 			console.log
// 		)
// 	)
// 	// .then(socket => socket.write('hello!'))
// 	.then(console.log)
// 	.catch(console.error)

const EventEmitter = require('events')

const myEmitter = new EventEmitter()

myEmitter.once('foo', () => console.log('foo 1'))
myEmitter.once('foo', () => console.log('foo 2'))

myEmitter.emit('foo')
myEmitter.emit('foo')
