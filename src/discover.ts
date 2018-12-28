import { createSocket } from 'dgram'

const searchTargetName = 'urn:schemas-denon-com:device:ACT-Denon:1'

const message = [
	'M-SEARCH * HTTP/1.1',
	'HOST: 239.255.255.250:1900',
	`ST: ${searchTargetName}`,
	'MX: 3',
	'MAN: "ssdp:discover"',
	'\r\n'
].join('\r\n')

type RInfo = {
	address: string
	family: string
	port: number
	size: number
}

export function discoverDevices(
	onDiscover: (address: string) => void,
	timeout: number = 20000
): void {
	const socket = createSocket('udp4')
	socket.bind(1900)

	socket.send(message, 1900, '239.255.255.250')

	socket.on('message', (msg: string, rinfo: RInfo) => {
		if (msg.includes(searchTargetName)) {
			onDiscover(rinfo.address)
		}
	})

	if (timeout) {
		setTimeout(() => {
			socket.close()
		}, timeout)
	}
}
