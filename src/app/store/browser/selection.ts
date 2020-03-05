import { call, select, getContext, put, takeEvery } from 'redux-saga/effects';

import { createAsyncAction } from '@lib/redux/actions';
import { createAsyncReducer } from '@lib/redux/async-reducer';
import { PayloadAction, createAction, PayloadMetaAction } from 'typesafe-actions';
import { ApplicationState } from '..';
import { AsyncState } from '@lib/redux/state';
import { Object } from 'aws-sdk/clients/s3';

export const actionType = {
	SELECTION_UPDATE: '@store/browser/SELECTION_UPDATE',
};

export interface SelectionUpdateRequest {
	type: 'add' | 'remove';
	keys: string[];
}

export const actionSelectionUpdate = createAsyncAction<SelectionUpdateRequest, string[]>(actionType.SELECTION_UPDATE),

export const reducer = createAsyncReducer<string[]>(actionType.SELECTION_UPDATE);

export function* watcher() {
	yield takeEvery(actionType.SELECTION_UPDATE, worker);
}

// this will, in future, scan async the sub-keys if needed
function* worker({ payload }: PayloadAction<string, SelectionUpdateRequest>) {
	const previousSelection: AsyncState<string[]> = yield select((state: ApplicationState) => state.browser.selection);
	const listObjects: AsyncState<Object[]> = yield select((state: ApplicationState) => state.objects.listObjects);

	// we're not quite there yet, boy
	if (previousSelection.loading || listObjects.loading)
		return;

	let selection = previousSelection.response || [];

	if (payload.type === 'remove') {
		payload.keys.forEach(k => {
			selection = selection.filter(sk => !sk.startsWith(k));
		});

		yield put(actionSelectionUpdate.success(selection));
	} else {
		// TODO: dis not great. should find a better solution for it
		listObjects.response.forEach(o => {
			payload.keys.forEach(k => {
				if (o.Key.startsWith(k))
					selection.push(o.Key);
			});
		})

		selection = Array.from(new Set([...selection]));

		yield put(actionSelectionUpdate.success(selection));
	}
}
