let response = {
	msg: 'urn:schemas-denon-com:device:ACT-Denon:1',
	rinfo: { address: '192.168.0.5' }
}

export function __setMsg(msg: string) {
	response.msg = msg
}

export function __setAddress(address: string) {
	response.rinfo.address = address
}

let on = (_event: string, callback: Function) => {
	process.nextTick(() => callback(response.msg, response.rinfo))
}

export function __setOn(newOn: any) {
	on = newOn
}

export function createSocket() {
	return {
		bind: jest.fn(),
		send: jest.fn(),
		on,
		close: jest.fn()
	}
}

const dgram = { createSocket, __setMsg, __setAddress, __setOn }

export default dgram
