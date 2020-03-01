import { CallableForKey } from './types';
import { createAction } from 'typesafe-actions';

export const success = (action: string) => `${action}:SUCCESS`;
export const failure = (action: string) => `${action}:FAILURE`;

export const createAsyncAction = <TReq, TRes, TErr = Error>(requestAction: string) => {
	return {
		request: createAction(requestAction, resolve => (payload: TReq) => resolve(payload))(),
		success: createAction(success(requestAction), resolve => (payload: TRes) => resolve(payload))(),
		failure: createAction(failure(requestAction), resolve => (payload: TErr) => resolve(payload))(),
	};
};

export const createAsyncMapAction = <TReq, TRes, TErr = Error>(requestAction: string, key: CallableForKey<TReq>) => {
	return {
		request: createAction(requestAction, (payload: TReq) => payload, (payload: TReq) => key(payload))(),
		success: createAction(success(requestAction), (id: string, payload: TRes) => payload, (id: string, payload: TRes) => ({ id }))(),
		failure: createAction(failure(requestAction), (id: string, payload: TErr) => payload, (id: string, payload: TErr) => ({ id }))(),
	};
};
