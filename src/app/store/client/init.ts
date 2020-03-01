import { AWSClient, AWSConfig } from 'src/app/classes/client';
import { call, getContext, put, takeEvery } from 'redux-saga/effects';

import ClientError from '@lib/error';
import { ClientStatus } from './types';
import { PayloadAction } from 'typesafe-actions';
import { createAsyncAction } from '@lib/redux/actions';
import { createAsyncReducer } from '@lib/redux/async-reducer';

export const actionType = {
	INIT: '@store/client/INIT',
};

export const action = {
	init: createAsyncAction<undefined, ClientStatus>(actionType.INIT),
	setCredential: createAsyncAction<AWSConfig, ClientStatus>(actionType.INIT),
};

export const reducer = createAsyncReducer<ClientStatus>(actionType.INIT);

export function* watcher() {
	yield takeEvery(actionType.INIT, worker);
}

function* worker({ payload }: PayloadAction<string, AWSConfig>) {
	const client: AWSClient = yield getContext('aws');

	try {
		if (payload) {
			client.setConfig(payload);
		} else {
			client.loadConfig();
		}

		const resp = yield call(client.listObjects, { Prefix: '/' });

		yield put(action.init.success({
			auth: true,
			loaded: true,
		}));
	} catch (error) {
		yield put(action.init.failure(ClientError.coerce(error)));
	}
}
