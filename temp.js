const dgram = require('dgram')
const server = dgram.createSocket('udp4')

const searchTargetName = 'urn:schemas-denon-com:device:ACT-Denon:1'

server.on('message', (msg, rinfo) => {
	if (msg.includes(searchTargetName))
		console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`)
})

// server.on('listening', () => {
// 	const address = server.address()
// 	console.log(`server listening ${address.address}:${address.port}`)
// })

server.bind(1900)

const message = [
	'M-SEARCH * HTTP/1.1',
	'HOST: 239.255.255.250:1900',
	`ST: ${searchTargetName}`,
	'MX: 3',
	'MAN: "ssdp:discover"',
	'\r\n'
].join('\r\n')

// const client = dgram.createSocket('udp4')

server.send(message, 1900, '239.255.255.250', err => {
	if (err) {
		console.error('ERROR!')
		console.error(err)
	} else {
		console.log(`sent message: ${message}`)
	}
})

setTimeout(() => {
	server.close()
}, 4000)
