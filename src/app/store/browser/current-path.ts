import { put, takeEvery } from 'redux-saga/effects';

import { createAsyncAction } from '@lib/redux/actions';
import { createAsyncReducer } from '@lib/redux/async-reducer';
import { PayloadAction } from 'typesafe-actions';

export const actionType = {
	SET_CURRENT_PATH: '@store/browser/SET_CURRENT_PATH',
};

export interface SetCurrentPathRequest {
	path: string;
}

export const actionSetPath = createAsyncAction<SetCurrentPathRequest, string>(actionType.SET_CURRENT_PATH),

export const reducer = createAsyncReducer<string[]>(actionType.SET_CURRENT_PATH);

export function* watcher() {
	yield takeEvery(actionType.SET_CURRENT_PATH, worker);
}

// TODO
// this is a saga because: we might need to do this async to give time to the browser to update?
function* worker({ payload }: PayloadAction<string, SetCurrentPathRequest>) {
	yield put(actionSetPath.success(payload.path));
}
