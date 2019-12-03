import { AWSError, S3 } from 'aws-sdk';
import putObjectsReducer, { FileState, getInitialState } from '../reducers/put-objects';
import { useCallback, useContext, useEffect, useReducer } from 'react';

import { Client } from '../client';
import ClientContext from '../contexts/client';
import { Progress } from 'aws-sdk/lib/request';
import { WebkitFile } from '../@types/webkit-file';

const initialState = getInitialState();

const usePutObjects = () => {
	const [state, dispatch] = useReducer(putObjectsReducer, initialState);
	const ctxClient = useContext<Client>(ClientContext);

	const submit = useCallback(() => {
		if (state.files.length)
			return dispatch({ type: 'submit' });

		dispatch({ type: 'dang!', error: 'no_files_selected' });
	}, [state.files.length]);

	const addFiles = (files: WebkitFile[]) => {
		const mappedFiles = files.map((file, index) => ({
			fileId: `${index}${(new Date()).getTime()}`,
			file,
		}));

		dispatch({
			type: 'load',
			files: mappedFiles,
		});
	};

	// Sets the next file when it detects that its ready to go
	useEffect(() => {
		if (state.pending.length && state.next == null) {
			const next = state.pending[0];

			dispatch({ type: 'next', next });
		}
	}, [state.next, state.pending]);

	// Process the next pending file when ready
	useEffect(() => {
		if (!state.pending.length || !state.next || state.working)
			return;

		const { next } = state;
		const nextFile = state.files.find(f => f.fileId === next);

		// booooo
		if (!nextFile)
			throw new Error('file_not_found_in_state');

		dispatch({
			type: 'init-upload',
			fileId: nextFile.fileId,
		});

		ctxClient.putObject({
			Key: `${nextFile.file.name}:${(new Date).getTime()}`,
			Body: nextFile.file,
			ACL: 'private',
			onProgress: (progress: Progress) => {
				const percentage = progress.loaded / progress.total;
				// const completed = progress.loaded === progress.total;

				const state: Partial<FileState> = {
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
	}, [state]);

	// Ends the upload process
	useEffect(() => {
		if (!state.pending.length && !state.next && !state.working)
			dispatch({ type: 'idle' });
	}, [state.pending.length, state.next, state.working]);

	return {
		state,
		submit,
		addFiles,
	}
}

export default usePutObjects;
