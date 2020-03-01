import { AsyncMapState, AsyncProgressState, AsyncState } from './state';
import { PayloadAction, PayloadMetaAction, Reducer } from 'typesafe-actions';

export type CallableForKey<T> = (payload: T) => string;
export interface MapPayloadMeta {
	id: string;
}

export type AsyncMapReducer<R, E> = Reducer<AsyncMapState<R, E>, PayloadMetaAction<string, R | E, MapPayloadMeta>>;
export type AsyncReducer<R, E> = Reducer<AsyncState<R, E>, PayloadAction<string, R | E>>;
export type AsyncProgressReducer<R, P, E> = Reducer<AsyncProgressState<R, P, E>, PayloadAction<string, R | P | E>>;
