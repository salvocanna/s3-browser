import * as listObjects from './list-objects';

import { AsyncState, initialAsyncState } from '@lib/redux/state';
import { all, fork } from 'redux-saga/effects';

import { ObjectList } from './types';
import { combineReducers } from 'redux';

export interface ObjectsState {
	listObjects: AsyncState<ObjectList>;
}

export const initialObjectsState: ObjectsState = {
	listObjects: {...initialAsyncState},
}

export const objectsActionTypes = {
	...listObjects.actionType,
};

export const objectsActions = {
	...listObjects.action,
};

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
