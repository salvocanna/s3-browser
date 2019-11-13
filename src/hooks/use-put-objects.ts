import { ChangeEvent, FormEvent, useCallback, useContext, useEffect, useReducer, useState } from 'react';

import { Client } from '../client';
import ClientContext from '../contexts/client';
import { S3 } from 'aws-sdk';

const fakeApi = {
	uploadFile: ({ timeout = 550 }) =>
		new Promise((resolve) => {
			setTimeout(() => {
				resolve();
			}, timeout);
		}),
}

interface EnrichedFile {
	fileId: string;
	file: File;
}

interface FileState {
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

const initialState: PutObjectsState = {
	files: [],
	filesState: {},
	pending: [],
	next: void 0,
	working: false,
	error: void 0,
	// todo: review if this is actually needed for convenience or can be inferred
	status: 'idle',
};

export type PutObjectAction =
	| { type: 'load', files: EnrichedFile[] }
	| { type: 'submit', fileIds?: string[] }
	| { type: 'next', next: string | void }
	| { type: 'progress', fileId: string, state: Partial<FileState> }
	| { type: 'uploaded', pending: string[], prev: string }
	| { type: 'completed' }
	| { type: 'dang!', error: Error | string }
;

const reducer = (state: PutObjectsState, action: PutObjectAction): PutObjectsState => {
	switch (action.type) {
		case 'load':
			return {
				...state,
				files: action.files,
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

const usePutObjects = () => {
	const [state, dispatch] = useReducer(reducer, initialState);

	const onSubmit = useCallback((e: FormEvent) => {
		e.preventDefault();

		if (state.files.length)
			dispatch({ type: 'submit' });
		else
			dispatch({ type: 'dang!', error: 'no_files_selected' });
	}, [state.files.length]);

	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files.length) {
			const arrFiles = Array.from(e.target.files);

			const files = arrFiles.map((file, index) => ({
				fileId: `${index}${(new Date()).getTime()}`,
				file,
			}));

			dispatch({
				type: 'load',
				files,
			});
		}
	};

	// Sets the next file when it detects that its ready to go
	useEffect(() => {
		if (state.pending.length && state.next == null) {
			const next = state.pending[0];

			dispatch({ type: 'next', next })
		}
	}, [state.next, state.pending]);

	// Processes the next pending thumbnail when ready
	useEffect(() => {
		if (state.pending.length && state.next) {
			const { next } = state
			fakeApi
				// .uploadFile(next)
				.uploadFile({ timeout: Math.floor(Math.random() * 5000) })
				.then(() => {
					const prev = next;

					const pending = state.pending.slice(1);

					dispatch({ type: 'uploaded', prev, pending })
				})
				.catch((error) => {
					dispatch({ type: 'dang!', error })
				});
		}
	}, [state]);

	// Ends the upload process
	useEffect(() => {
		if (!state.pending.length && state.working) {
			dispatch({
				type: 'completed',
			})
		}
	}, [state.pending.length, state.working]);

	return {
		state,
		onSubmit,
		onChange,
	}
}

export default usePutObjects;
