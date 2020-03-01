import { CallableForKey } from './types';
import { createAction } from 'typesafe-actions';

export const success = (action: string) => `${action}:SUCCESS`;
export const failure = (action: string) => `${action}:FAILURE`;

export const createAsyncAction = <TReq, TRes, TErr = Error>(requestAction: string) => {
	return {
		request: createAction(requestAction, resolve => (payload: TReq) => resolve(payload)),
		success: createAction(success(requestAction), resolve => (payload: TRes) => resolve(payload)),
		failure: createAction(failure(requestAction), resolve => (payload: TErr) => resolve(payload)),
	};
};

export const createAsyncMapAction = <TReq, TRes, TErr = Error>(requestAction: string, key: CallableForKey<TReq>) => {
	return {
		request: createAction(requestAction, resolve => (payload: TReq) => resolve(payload, { id: key(payload) })),
		success: createAction(success(requestAction), resolve => (id: string, payload: TRes) => resolve(payload, { id })),
		failure: createAction(failure(requestAction), resolve => (id: string, payload: TErr) => resolve(payload, { id })),
	};
};
