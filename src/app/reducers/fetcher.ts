export interface State<T, E = any> {
	response?: T;
	fetching: boolean;
	error?: E;
}

export type Action<T, E = any> = { type: 'request' } | { type: 'success', response: T } | { type: 'failure', error: E };

// LOL at State in here, the nature of this reducer means we don't actually care about any
// previous state as we wipe it every time, and there's a guarantee that if `error` !== void 0
// there can't be a response, etc..
const createFetcherReducer = <T, E>() => (state: State<T, E>, action: Action<T, E>): State<T, E> => {
	switch (action.type) {
		case 'request':
			return { fetching: true };
		case 'success':
			return {
				fetching: false,
				response: action.response,
			};
		case 'failure':
			return {
				fetching: false,
				error: action.error,
			};
		default:
			// whoops..watcha tryna do m8
			throw `Unrecognized action, ${JSON.stringify(action)} on fetcherReducer`;
	}
};

export default createFetcherReducer;
