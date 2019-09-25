import { HeosResponse, HeosResponseMessage } from '../types'
import {
	FIRST_LEVEL_HEOS_RESPONSE_MESSAGE_SPLITTER,
	SECOND_LEVEL_HEOS_RESPONSE_MESSAGE_SPLITTER
} from '../utils/constants'

export function parseHeosMessageString(messageString: string | undefined): HeosResponseMessage {
	let parsedMessageObject: any = {}

	if (typeof messageString === 'string') {
		parsedMessageObject = messageString
			.split(FIRST_LEVEL_HEOS_RESPONSE_MESSAGE_SPLITTER)
			.reduce((parsedPart, keyAndValuePair) => {
				const [key, value, ...rest]: string[] = keyAndValuePair.split(
					SECOND_LEVEL_HEOS_RESPONSE_MESSAGE_SPLITTER
				)

				return {
					...parsedPart,
					...(key &&
						value &&
						!rest.length && { [key]: !isNaN(Number(value)) ? Number(value) : value })
				}
			}, parsedMessageObject)
	}

	return {
		...(typeof messageString === 'string' && { unparsed: messageString }),
		...(Object.keys(parsedMessageObject).length && { parsed: parsedMessageObject })
	}
}
