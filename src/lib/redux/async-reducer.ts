import { AsyncState, initialAsyncState } from './state';
import { failure, success } from './actions';

import { AsyncReducer } from './types';
import ClientError from '@lib/error';

export const createAsyncReducer =
	<R, E = ClientError>(request: string, initialState: AsyncState<R, E> = initialAsyncState): AsyncReducer<R, E> =>
		(state = initialState, { type, payload }) => {
			switch (type) {
				case request:
					return {
						...state,
						fetching: true,
					};

				case success(request):
					return {
						...state,
						fetching: false,
						response: payload as R,
					};

				case failure(request):
					return {
						...state,
						fetching: false,
						error: payload as E,
					};

				default:
					return state;
			}
		}
