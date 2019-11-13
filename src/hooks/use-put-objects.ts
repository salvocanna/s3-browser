import { ChangeEvent, FormEvent, useCallback, useContext, useEffect, useReducer, useState } from 'react';
import putObjectsReducer, { getInitialState } from '../reducers/put-objects';

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

const initialState = getInitialState();

const usePutObjects = () => {
	const [state, dispatch] = useReducer(putObjectsReducer, initialState);

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
