import { AWSError, S3 } from 'aws-sdk';
import deleteObjectsReducer, { getInitialState } from '../reducers/delete-objects';
import { useContext, useEffect, useReducer } from 'react';

import { Client } from '../client';
import ClientContext from '../contexts/client';

const initialState = getInitialState();

const useDeleteObjects = () => {
	const [state, dispatch] = useReducer(deleteObjectsReducer, initialState);
	const ctxClient = useContext<Client>(ClientContext);

	// load => keys[]
	// load-batch
	// run
	// next - batch
	// batch - completed
	// error
	// done

	const fetchAllKeys = async (Prefix: string) => {
		const result = await ctxClient.listObjects({
			MaxKeys: 1000, // Nice one. LOL
			Prefix,
		});

		dispatch({
			type: 'load-batch',
			keys: result.Contents.map(k => k.Key)
		});
	};

	const addKey = (key: string, crawl = true) => {
		if (!crawl)
			dispatch({ type: 'load', key });
		else
			fetchAllKeys(key);
	};

	const addKeys = (keys: string[]) => {
		dispatch({ type: 'load', keys });
	};

	const run = () => dispatch({ type: 'run' });

	useEffect(() => {
		if (state.pending.length && !state.next.length)
			dispatch({ type: 'next-batch'});
		else
			dispatch({ type: 'done' });
	}, [state.pending]);


	// Sets the next file when it detects that its ready to go
	useEffect(() => {
		if (state.next.length) {
			ctxClient.deleteObjects({
				Delete: {
					Objects: state.next.map(Key => ({ Key })),
				},
			})
				.then((value: S3.DeleteObjectsOutput) => {
					console.log('Deleted: ', value.Deleted);

					dispatch({ type: 'batch-completed' });
			}).catch((error: AWSError) => {
				dispatch({ type: 'error', error });
			});
		}
	}, [state.next]);

	return {
		state,
		addKeys,
		run,
	}
}

export default useDeleteObjects;
