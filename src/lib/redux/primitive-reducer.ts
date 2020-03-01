import { PayloadAction } from 'typesafe-actions';
import { Reducer } from 'redux';

export const createPrimitiveReducer =
	<T>(request: string, initialState: T): Reducer<T, PayloadAction<string, T>> =>
		(state = initialState, { type, payload }) => {
			switch (type) {
				case request:
					return payload;

				default:
					return state;
			}
		};
