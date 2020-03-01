import { call, getContext, put, takeEvery } from 'redux-saga/effects';

import { AsyncState } from '@lib/redux/state';
import { ObjectList } from './types';
import { createAsyncAction } from '@lib/redux/actions';
import { createAsyncReducer } from '@lib/redux/async-reducer';

export const actionType = {
	LIST_OBJECTS: '@store/objects/LIST_OBJECTS',
};

export const action = {
	listObjects: createAsyncAction<undefined, ObjectList>(actionType.LIST_OBJECTS),
};

export const reducer = createAsyncReducer<ObjectList>(actionType.LIST_OBJECTS);

export function* watcher() {
	yield takeEvery(actionType.LIST_OBJECTS, worker);
}

// function* worker({ payload }: PayloadAction<string, undefined>) {
function* worker() {
	// const client: any = yield getContext('aws');

	try {
		// fetch pagination here..
		console.log("got in saga");


		yield put(action.listObjects.success(23));
	} catch (error) {
		yield put(action.listObjects.failure(error));
	}
}
