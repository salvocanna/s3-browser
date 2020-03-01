import { call, getContext, put, takeEvery } from 'redux-saga/effects';

import { AWSClient } from 'src/app/classes/client';
import { ClientStatus } from './types';
import { createAsyncAction } from '@lib/redux/actions';
import { createAsyncReducer } from '@lib/redux/async-reducer';

export const actionType = {
	CREATE_CLIENT: '@store/client/CREATE_CLIENT',
};

export const action = {
	createClient: createAsyncAction<undefined, ClientStatus>(actionType.CREATE_CLIENT),
};

export const reducer = createAsyncReducer<ClientStatus>(actionType.CREATE_CLIENT);

export function* watcher() {
	yield takeEvery(actionType.CREATE_CLIENT, worker);
}

function* worker() {
	const client: AWSClient = yield getContext('aws');

	try {
		client.loadConfig();

		client.listObjects({ Prefix: '/' });

		yield put(action.createClient.success({
			auth: true,
			loaded: true,
		}));
	} catch (error) {
		yield put(action.createClient.failure(error));
	}
}
