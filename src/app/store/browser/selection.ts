import { call, select, getContext, put, takeEvery } from 'redux-saga/effects';

import { createAsyncAction } from '@lib/redux/actions';
import { createAsyncReducer } from '@lib/redux/async-reducer';
import { PayloadAction, createAction, PayloadMetaAction } from 'typesafe-actions';
import { ApplicationState } from '..';
import { AsyncState } from '@lib/redux/state';

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

// this will, in future, scan the sub-keys if needed
function* worker({ payload }: PayloadAction<string, SelectionUpdateRequest>) {
	const previousSelection: AsyncState<string[]> = yield select((state: ApplicationState) => state.browser.selection);

	// we're not quite there yet, boy
	if (previousSelection.loading)
		return;

	let selection = previousSelection.response || [];

	if (payload.type === 'remove') {
		payload.keys.forEach(k => {
			selection = selection.filter(sk => !sk.startsWith(k));
		});

		yield put(actionSelectionUpdate.success(selection));
	} else {
		selection = Array.from(new Set([...payload.keys, ...selection]));

		yield put(actionSelectionUpdate.success(selection));
	}
}
