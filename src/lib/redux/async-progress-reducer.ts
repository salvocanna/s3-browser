import { AsyncProgressState, initialAsyncState } from './state';
import { failure, progress, success } from './actions';

import { AsyncProgressReducer } from './types';
import ClientError from '@lib/error';

export const createAsyncProgressReducer =
	<R, P, E = ClientError>(request: string, initialState: AsyncProgressState<R, P, E> = initialAsyncState): AsyncProgressReducer<R, P, E> =>
		(state = initialState, { type, payload }) => {
			switch (type) {
				case request:
					return {
						...state,
						fetching: true,
					};

				case progress(request):
					return {
						...state,
						fetching: true,
						progress: payload as P,
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
