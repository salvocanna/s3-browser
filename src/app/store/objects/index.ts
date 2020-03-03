import * as listObjects from './list-objects';

import { AsyncState, initialAsyncState } from '@lib/redux/state';
import { all, fork } from 'redux-saga/effects';

import { ObjectList } from 'aws-sdk/clients/s3';
import { combineReducers } from 'redux';

export interface ObjectsState {
	listObjects: AsyncState<ObjectList>;
}

export const initialState: ObjectsState = {
	listObjects: {...initialAsyncState},
}

export const objectsReducers = combineReducers({
	listObjects: listObjects.reducer,
});

export function* objectsSaga() {
	yield all([
		fork(listObjects.watcher),
	]);
}

// export { default as xxx } from './xxx.js';
// export * from './xxx.js';
