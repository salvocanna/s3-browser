import { call, getContext, put, takeEvery } from 'redux-saga/effects';

import { ClientStatus } from './types';
import { createAsyncAction } from '@lib/redux/actions';
import { createAsyncReducer } from '@lib/redux/async-reducer';

export const actionType = {
	CREATE_CLIENT: '@store/objects/CREATE_CLIENT',
};

export const action = {
	createClient: createAsyncAction<undefined, ClientStatus>(actionType.CREATE_CLIENT),
};

export const reducer = createAsyncReducer<ClientStatus>(actionType.CREATE_CLIENT);

export function* watcher() {
	yield takeEvery(actionType.CREATE_CLIENT, worker);
}

function* worker() {
	// const client: any = yield getContext('aws');

	console.log("got in saga /2");

	try {
		// fetch pagination here..
		console.log("got in saga /2");


		yield put(action.createClient.success(23));
	} catch (error) {
		yield put(action.createClient.failure(error));
	}
}
