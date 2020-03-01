import ClientError from '@lib/error';

export type AsyncState<R, E = ClientError> =
	| {
		loading: boolean;
		error?: E | undefined;
		response?: R | undefined;
	}
	| {
		loading: false;
		error: E;
		response?: undefined;
	}
	| {
		loading: false;
		error?: undefined;
		response: R;
	}
;

export type AsyncMapState<R, E = ClientError> = Record<string, AsyncState<R, E>>;

export type AsyncProgressState<R, P, E = ClientError> = AsyncState<R, E>  & { progress?: P };

export const initialAsyncState = {
	loading: false,
};
