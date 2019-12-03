import { WebkitFile } from '../@types/webkit-file';

interface WrappedFile {
	fileId: string;
	file: WebkitFile;
};

export interface FileState {
	completed: boolean;
	progress: number;
	working: boolean;
	error: Error | string;
}

interface PutObjectsState {
	files: WrappedFile[];
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
	| { type: 'load', files: WrappedFile[] }
	| { type: 'submit', fileIds?: string[] }
	| { type: 'next', next: string }
	| { type: 'init-upload', fileId: string }
	| { type: 'progress', fileId: string, state: Partial<FileState> }
	| { type: 'uploaded', pending: string[], fileId: string }
	| { type: 'dang!', error: Error | string }
	;

// todo: Note: filesState continuous deeply nested spreading is not great

const putObjectsReducer = (state: PutObjectsState, action: PutObjectAction): PutObjectsState => {
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
				filesState: {
					...state.filesState,
					[action.fileId]: {
						...state.filesState[action.fileId],
						working: true,
					},
				},
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
				filesState: {
					...state.filesState,
					[action.fileId]: {
						...state.filesState[action.fileId],
						working: false,
						completed: state.filesState[action.fileId].progress === 1,
					},
				},
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
