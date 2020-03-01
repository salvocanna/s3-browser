import * as init from './init';

import { AsyncState, initialAsyncState } from '@lib/redux/state';
import { all, fork } from 'redux-saga/effects';

import { ClientStatus } from './types';
import { combineReducers } from 'redux';

export interface ClientState {
	init: AsyncState<ClientStatus>;
}

export const initialState: ClientState = {
	init: {...initialAsyncState},
}

export const clientActionTypes = {
	...init.actionType,
};

export const clientActions = {
	...init.action,
};

export const clientReducers = combineReducers({
	init: init.reducer,
});

export function* clientSaga() {
	yield all([
		fork(init.watcher),
	]);
}
