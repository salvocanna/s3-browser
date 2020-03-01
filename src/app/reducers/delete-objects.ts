interface DeleteObjectsState {
	keys: string[];
	pending: string[];
	error: any;
}

export const getInitialState: () => DeleteObjectsState = () => ({
	keys: [],
	pending: [],
	error: void 0,
});

export type DeleteObjectsAction =
	| { type: 'load', keys: string[] }
	| { type: 'run' }
	| { type: 'completed' }
	| { type: 'error', error: any }
	;

const deleteObjectsReducer = (state: DeleteObjectsState, action: DeleteObjectsAction): DeleteObjectsState => {
	switch (action.type) {
		case 'load':
			return {
				...state,
				keys: action.keys,
				pending: [],
			};

		// V simplified for now.
		case 'run':
			return {
				...state,
				keys: [],
				pending: state.keys,
			};

		case 'completed':
			return {
				...state,
				keys: [],
				pending: [],
			};

		case 'error':
			return {
				keys: [],
				pending: [],
				error: action.error,
			};

		default:
			return state;
	}
};

export default deleteObjectsReducer;
