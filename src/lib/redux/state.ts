export type AsyncState<R, E = Error> =
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

export type AsyncMapState<R, E = Error> = Record<string, AsyncState<R, E>>;

export const initialAsyncState = {
	loading: false,
};
