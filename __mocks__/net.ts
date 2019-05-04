let onData = (callback: Function) =>
	process.nextTick(() =>
		callback(
			JSON.stringify({
				heos: {
					command: 'system/heart_beat',
					result: 'success',
					message: ''
				}
			}) + '\r\n'
		)
	)

let onError = (_callback: Function) => {}

let on = (event: string, callback: Function) => {
	if (event === 'data') {
		onData(callback)
	} else if (event === 'error') {
		onError(callback)
	}
}

export function __setOnData(newOnData: any) {
	onData = newOnData
}

export function __setOnError(newOnError: any) {
	onError = newOnError
}

export function __setOn(newOn: any) {
	on = newOn
}

export function createConnection(_options: object, callback: Function) {
	callback({ write: () => {}, on })
}

const net = { createConnection, __setOn, __setOnData, __setOnError }

export default net
