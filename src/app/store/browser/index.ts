import * as currentPath from './current-path';
import * as selection from './selection';

import { AsyncState, initialAsyncState } from '@lib/redux/state';
import { all, fork } from 'redux-saga/effects';

import { combineReducers } from 'redux';

export interface BrowserState {
	selection: AsyncState<string[]>;
	currentPath: AsyncState<string>;
}

export const initialState: BrowserState = {
	selection: { ...initialAsyncState },
	currentPath: { ...initialAsyncState },
}

export const browserReducers = combineReducers({
	selection: selection.reducer,
	currentPath: currentPath.reducer,
});

export function* browserSaga() {
	yield all([
		fork(selection.watcher),
		fork(currentPath.watcher),
	]);
}
