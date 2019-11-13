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
	next: string | void;
	working: boolean;
	error: Error | string;
	status: 'idle' | 'loaded' | 'init' | 'pending' | 'completed' | 'error';
}

export const getInitialState: () => PutObjectsState = () => ({
	files: [],
	filesState: {},
	pending: [],
	next: void 0,
	working: false,
	error: void 0,
	// todo: review if this is actually needed for convenience or can be inferred
	status: 'idle',
});

export type PutObjectAction =
	| { type: 'load', files: EnrichedFile[] }
	| { type: 'submit', fileIds?: string[] }
	| { type: 'next', next: string | void }
	| { type: 'progress', fileId: string, state: Partial<FileState> }
	| { type: 'uploaded', pending: string[], prev: string }
	| { type: 'completed' }
	| { type: 'dang!', error: Error | string }
;

const putObjectsReducer = (state: PutObjectsState, action: PutObjectAction): PutObjectsState => {
	switch (action.type) {
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
				working: true,
				pending: action.fileIds ? [...state.pending, ...action.fileIds] : state.files.map(f => f.fileId),
				status: 'init',
			};

		case 'next':
			return {
				...state,
				next: action.next,
				status: 'pending',
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
				pending: action.pending,
			};

		// When all files are completed
		case 'completed':
			return {
				...state,
				working: false,
				status: 'completed',
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
