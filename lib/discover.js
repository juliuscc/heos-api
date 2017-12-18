const Client = require('node-ssdp').Client

module.exports = () =>
	new Promise((resolve, reject) => {
		const client = new Client()

		client.on('response', (headers, statusCode, rinfo) => resolve(rinfo))

		client.on('error', err => {
			client.close()
			reject(err)
		})

		const searchTargetName = 'urn:schemas-denon-com:device:ACT-Denon:1'
		client.search(searchTargetName)
	})
