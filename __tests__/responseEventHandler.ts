import { ResponseSubscriptionHandler } from '../src/responseSubscriptionHandler'

describe('Heos responses can be correctly subscribed to', () => {
	test('Subscribers will not be triggered if no subscriptions are active', () => {
		const handler: ResponseSubscriptionHandler = new ResponseSubscriptionHandler()
	})
})
