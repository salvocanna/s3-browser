import { AWSError, S3 } from 'aws-sdk';
import deleteObjectsReducer, { getInitialState } from '../reducers/delete-objects';
import { useContext, useEffect, useReducer } from 'react';

import { Client } from '../client';
import ClientContext from '../contexts/client';

const initialState = getInitialState();

const useDeleteObjects = () => {
	const [state, dispatch] = useReducer(deleteObjectsReducer, initialState);
	const ctxClient = useContext<Client>(ClientContext);


	// type: 'load',
	// keys: result.Contents.map(k => k.Key)

	// type: 'run'

	// type: 'run'


	keys =>  pending

	dispatch({ type: 'completed' });

	dispatch({ type: 'error', error });


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
			type: 'load',
			keys: result.Contents.map(k => k.Key)
		});
	};

	const addKey = (key: string, crawl = true) => {
		if (!crawl)
			dispatch({ type: 'load', keys: [key] });
		else
			fetchAllKeys(key);
	};

	const run = () => dispatch({ type: 'run' });

	useEffect(() => {
		if (state.pending.length) {
			ctxClient.deleteObjects({
				Delete: {
					Objects: state.pending, // .map(Key => ({ Key })),
				},
			})
				.then((value: S3.DeleteObjectsOutput) => {
					console.log('Deleted: ', value.Deleted);

					dispatch({ type: 'completed' });
			}).catch((error: AWSError) => {
				dispatch({ type: 'error', error });
			});
		}
	}, [state.pending]);

	return {
		state,
		addKeys,
		run,
	}
}

export default useDeleteObjects;
