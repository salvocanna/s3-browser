import { call, getContext, put, takeEvery } from 'redux-saga/effects';

import { AWSClient } from '@lib/client';
import { ObjectList } from 'aws-sdk/clients/s3';
import { S3 } from 'aws-sdk';
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

function* worker() {
	const client: AWSClient = yield getContext('aws');

	try {
		let ContinuationToken: string = void 0;
		const keys = [];

		do {
			const response: S3.Types.ListObjectsV2Output = yield call(client.listObjects, {
				MaxKeys: 1000,
				ContinuationToken,
			});

			keys.push(...response.Contents);

			if (response.IsTruncated && response.NextContinuationToken)
				ContinuationToken = response.NextContinuationToken;
			else
				ContinuationToken = void 0;
		} while (ContinuationToken);

		yield put(action.listObjects.success(keys));
	} catch (error) {
		yield put(action.listObjects.failure(error));
	}
}
