import { AWSError, S3 } from 'aws-sdk';
import { ChangeEvent, FormEvent, useCallback, useContext, useEffect, useReducer, useState } from 'react';
import putObjectsReducer, { FileState, getInitialState } from '../reducers/put-objects';

import { Client } from '../client';
import ClientContext from '../contexts/client';
import { Progress } from 'aws-sdk/lib/request';

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
	const ctxClient = useContext<Client>(ClientContext);

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

			dispatch({ type: 'next', next });
		}
	}, [state.next, state.pending]);

	// Process the next pending thumbnail when ready
	useEffect(() => {
		if (state.pending.length && state.next) {
			const { next } = state;
			const nextFile = state.files.find(f => f.fileId === next);

			// booooo
			if (!nextFile)
				throw new Error('file_not_found_in_state');

			ctxClient.putObject({
				Key: `${nextFile.file.name}:${(new Date).getTime()}`,
				Body: nextFile.file,
				ACL: 'private',
				onProgress: (progress: Progress) => {
					const percentage = Math.round(progress.loaded / progress.total * 100);
					const completed = progress.loaded === progress.total;

					console.log(nextFile.fileId, percentage + '% done');

					const state: FileState = {
						completed,
						working: !completed,
						progress: percentage,
						error: void 0,
					};

					dispatch({
						type: 'progress',
						fileId: nextFile.fileId,
						state,
					});
				},
			})
				.then((value: S3.PutObjectOutput) => {
					const pending = state.pending.slice(1);

					dispatch({ type: 'uploaded', fileId: nextFile.fileId, pending });
				}).catch((error: AWSError) => {
					dispatch({ type: 'dang!', error });
				});
		}
	}, [state]);

	// Ends the upload process
	useEffect(() => {
		if (!state.pending.length && state.working) {
			dispatch({
				type: 'completed',
			});
		}
	}, [state.pending.length, state.working]);

	return {
		state,
		onSubmit,
		onChange,
	}
}

export default usePutObjects;
