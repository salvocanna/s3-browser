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

interface PutObjectsState {
	files: EnrichedFile[];
	pending: EnrichedFile[];
	next: EnrichedFile | void;
	uploading: boolean;
	uploaded: EnrichedFile[];
	status: 'IDLE' | 'LOADED' | 'INIT' | 'PENDING' | 'COMPLETED' | 'UPLOAD_ERROR';
	uploadError: unknown;
}

const initialState: PutObjectsState = {
	files: [],
	pending: [],
	next: null,
	uploading: false,
	uploaded: [],
	status: 'IDLE',
	uploadError: void 0,
};

export type PutObjectAction =
	| { type: 'load', files: EnrichedFile[] }
	| { type: 'submit' }
	| { type: 'next', next: EnrichedFile | void }
	| { type: 'file-uploaded', pending: EnrichedFile[], prev: EnrichedFile }
	| { type: 'completed' }
	| { type: 'set-upload-error', error: any }
;

const reducer = (state: PutObjectsState, action: PutObjectAction): PutObjectsState => {
	switch (action.type) {
		case 'load':
			return { ...state, files: action.files, status: 'LOADED' }
		case 'submit':
			return { ...state, uploading: true, pending: state.files, status: 'INIT' }
		case 'next':
			return {
				...state,
				next: action.next,
				status: 'PENDING',
			}
		case 'file-uploaded':
			return {
				...state,
				next: null,
				pending: action.pending,
				uploaded: [ ...state.uploaded, action.prev ],
			}
		case 'completed':
			return { ...state, uploading: false, status: 'COMPLETED' }
		case 'set-upload-error':
			return { ...state, uploadError: action.error, status: 'UPLOAD_ERROR' }
		default:
			return state
	}
};

const useFileHandlers = () => {
	const [state, dispatch] = useReducer(reducer, initialState)

	const onSubmit = useCallback((e: FormEvent) => {
		e.preventDefault();

		if (state.files.length)
			dispatch({ type: 'submit' });
		else // LOLs
			window.alert("You don't have any files loaded.");
	}, [state.files.length]);

	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files.length) {
			const arrFiles = Array.from(e.target.files);

			const files = arrFiles.map((file, index) => {
				const src = window.URL.createObjectURL(file)

				return { file, fileId: String(index), src };
			});

			dispatch({ type: 'load', files })
		}
	}

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

					dispatch({ type: 'file-uploaded', prev, pending })
				})
				.catch((error) => {
					console.error('.catch((error) => {', error);

					dispatch({ type: 'set-upload-error', error })
				});
		}
	}, [state]);

	// Ends the upload process
	useEffect(() => {
		if (!state.pending.length && state.uploading) {
			dispatch({ type: 'completed' })
		}
	}, [state.pending.length, state.uploading]);

	return {
		...state,
		onSubmit,
		onChange,
	}
}

export default usePutObjects;
