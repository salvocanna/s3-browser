import { call, select, getContext, put, takeEvery } from 'redux-saga/effects';

import { createAsyncAction } from '@lib/redux/actions';
import { createAsyncReducer } from '@lib/redux/async-reducer';
import { PayloadAction } from 'typesafe-actions';
import { ApplicationState } from '..';

export const actionType = {
	ADD_TO_SELECTION: '@store/browser/ADD_TO_SELECTION',
};

export const actionSelectionAdd = createAsyncAction<string[], string[]>(actionType.ADD_TO_SELECTION),

export const reducer = createAsyncReducer<string[]>(actionType.ADD_TO_SELECTION);

export function* watcher() {
	yield takeEvery(actionType.ADD_TO_SELECTION, worker);
}

// this will, in future, scan the sub-keys if needed
function* worker({ payload }: PayloadAction<string, string[]>) {
	const previousSelection = yield select((state: ApplicationState) => state.browser.selection);

	const selection = Array.from(new Set([...payload, ...previousSelection]));

	yield put(actionSelectionAdd.success(selection));
}
