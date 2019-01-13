import { createSocket } from 'dgram'

const searchTargetName = 'urn:schemas-denon-com:device:ACT-Denon:1'

const message = [
	'M-SEARCH * HTTP/1.1',
	'HOST: 239.255.255.250:1900',
	`ST: ${searchTargetName}`,
	'MX: 5',
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
	timeout: number = 5000,
	onDiscover: (address: string) => void,
	onTimeout?: (addresses: string[]) => void
): () => void {
	const socket = createSocket('udp4')
	socket.bind(1900)

	socket.send(message, 1900, '239.255.255.250')

	let addresses: string[] = []

	socket.on('message', (msg: string, rinfo: RInfo) => {
		if (msg.includes(searchTargetName)) {
			onDiscover(rinfo.address)
			addresses.push(rinfo.address)
		}
	})

	const timeOutReferance: NodeJS.Timeout = setTimeout(quit, timeout)

	function quit() {
		socket.close()
		if (onTimeout) {
			onTimeout(addresses)
		}

		global.clearTimeout(timeOutReferance)
	}

	return quit
}

export function discoverOneDevice(timeout: number = 10000): Promise<string> {
	return new Promise((resolve, reject) => {
		let oneDiscovered: boolean = false

		function onDiscover(adress: string): void {
			if (oneDiscovered) {
				return
			}

			oneDiscovered = true
			quit()
			resolve(adress)
		}

		function onTimeout(adresses: string[]) {
			if (!oneDiscovered) {
				reject('No devices found')
			}
		}

		const quit = discoverDevices(timeout, onDiscover, onTimeout)
	})
}
