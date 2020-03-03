import { AsyncMapReducer, MapPayloadMeta } from './types';
import { AsyncMapState, AsyncState, initialAsyncState } from './state';
import { failure, success } from './actions';

import ClientError from '@lib/error';
import { PayloadMetaAction } from 'typesafe-actions';

export const createAsyncMapReducer =
	<R, E = ClientError>(request: string, initialState: AsyncMapState<R, E> = {}): AsyncMapReducer<R, E> =>
		(state = initialState, { type, payload, meta }): AsyncMapState<R, E> => {
			switch (type) {
				case request:
					return {
						...state,
						[meta.id]: {
							...state[meta.id],
							loading: true,
						},
					};

				case success(request):
					return {
						...state,
						[meta.id]: {
							loading: false,
							response: payload as R,
						} as AsyncState<R, E>,
					};

				case failure(request):
					return {
						...state,
						[meta.id]: {
							loading: false,
							error: payload as E,
						} as AsyncState<R, E>,
					};

				default:
					return state;
			}
		}
