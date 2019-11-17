interface EnrichedFile {
	fileId: string;
	file: File;
}

export interface FileState {
	completed: boolean;
	progress: number;
	working: boolean;
	error: Error | string;
}

interface PutObjectsState {
	files: EnrichedFile[];
	filesState: Record<string, FileState>;
	pending: string[];
	next: string;
	working: string;
	error: Error | string;
	status: 'idle' | 'loaded' | 'init' | 'pending' | 'error';
}

export const getInitialState: () => PutObjectsState = () => ({
	files: [],
	filesState: {},
	pending: [],
	next: void 0,
	working: void 0,
	error: void 0,
	// todo: review if this is actually needed for convenience or can be inferred
	status: 'idle',
});

export type PutObjectAction =
	| { type: 'idle' }
	| { type: 'load', files: EnrichedFile[] }
	| { type: 'submit', fileIds?: string[] }
	| { type: 'next', next: string }
	| { type: 'init-upload', fileId: string }
	| { type: 'progress', fileId: string, state: Partial<FileState> }
	| { type: 'uploaded', pending: string[], fileId: string }
	| { type: 'dang!', error: Error | string }
;

const putObjectsReducer = (state: PutObjectsState, action: PutObjectAction): PutObjectsState => {
	console.log(action.type, action, state);
	switch (action.type) {
		case 'idle':
			return {
				...state,
				status: 'idle',
			};

		case 'load':
			return {
				...state,
				files: [...state.files, ...action.files],
				status: 'loaded',
				filesState: {
					...state.filesState,
					...action.files.reduce((prevValue, currValue) => ({
						...prevValue,
						[currValue.fileId]: {
							completed: false,
							progress: 0,
							working: false,
							error: void 0,
						} as FileState,
					}), {}),
				},
			};

		case 'submit':
			return {
				...state,
				// working: ,
				pending: action.fileIds ? [...state.pending, ...action.fileIds] : state.files.map(f => f.fileId),
				status: 'init',
			};

		case 'next':
			return {
				...state,
				next: action.next,
				status: 'pending',
			};

		case 'init-upload':
			return {
				...state,
				working: action.fileId,
			};

		case 'progress':
			return {
				...state,
				filesState: {
					...state.filesState,
					[action.fileId]: {
						// yeah spread it! 😏
						...state.filesState[action.fileId],
						...action.state,
					},
				},
			};

		// When a single file is completed
		case 'uploaded':
			return {
				...state,
				next: null,
				working: void 0,
				pending: action.pending,
			};

		case 'dang!':
			return {
				...state,
				error: action.error,
				status: 'error',
			};

		default:
			return state;
	}
};

export default putObjectsReducer;
