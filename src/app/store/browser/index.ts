import * as selection from './selection';

import { AsyncState, initialAsyncState } from '@lib/redux/state';
import { all, fork } from 'redux-saga/effects';

import { combineReducers } from 'redux';

export interface BrowserState {
	selection: AsyncState<string[]>;
}

export const initialState: BrowserState = {
	selection: {...initialAsyncState},
}

export const browserReducers = combineReducers({
	selection: selection.reducer,
});

export function* browserSaga() {
	yield all([
		fork(selection.watcher),
	]);
}
