import * as createClient from './create-client';

import { AsyncState, initialAsyncState } from '@lib/redux/state';
import { all, fork } from 'redux-saga/effects';

import { ClientStatus } from './types';
import { combineReducers } from 'redux';

export interface ClientState {
	createClient: AsyncState<ClientStatus>;
}

export const initialState: ClientState = {
	createClient: {...initialAsyncState},
}

export const clientActionTypes = {
	...createClient.actionType,
};

export const clientActions = {
	...createClient.action,
};

export const clientReducers = combineReducers({
	createClient: createClient.reducer,
});

export function* clientSaga() {
	yield all([
		fork(createClient.watcher),
	]);
}
