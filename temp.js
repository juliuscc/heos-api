const { discoverOneDevice } = require('./lib/discover')
const { connect } = require('./lib/connection')

discoverOneDevice(3000)
	.then(address =>
		connect(
			address,
			console.log
		)
	)
	// .then(socket => socket.write('hello!'))
	.then(console.log)
	.catch(console.error)
