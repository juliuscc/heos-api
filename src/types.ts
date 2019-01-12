export type HeosResponse = {
	heos: {
		command: string
		result: string
		message: string
	}
	payload?: object | any[]
	options?: object
}
