const heos = require('.')

;(async () => {
	// address = await heos.discoverOneDevice()
	// console.log('Found device')
	// console.log({ address })
	const connection = await heos.discoverAndConnect()
	// connection.onAll(console.log).write('player', 'get_players')
	connection.onAll(console.log).write('player', 'set_volume', { pid: 1691515757, level: 35 })

	// connection.onAll(console.log).write('system', 'prettify_json_response', { enable: 'on' })
})()
