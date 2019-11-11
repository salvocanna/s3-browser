import createFetcherReducer, { State } from '../reducers/fetcher';
import { useContext, useEffect, useReducer, useState } from 'react';

import ClientContext from '../contexts/client';
import { S3 } from 'aws-sdk';
import { Client } from '../client';

const fetcherReducer = createFetcherReducer<S3.ListObjectsOutput, unknown>();

const initialState = { fetching: false };

const useListObjects = (initialPath: string, initialData: State<S3.ListObjectsOutput> = initialState) => {
	const [path, setPath] = useState(initialPath);
	const [state, dispatch] = useReducer(fetcherReducer, initialData);
	const ctxClient = useContext<Client>(ClientContext);

	useEffect(() => {
		let cancelled = false;

		const fetchData = async () => {
			dispatch({ type: 'request' });

			try {
				const result = await ctxClient.listObjects({
					MaxKeys: 300,
					Delimiter: '/',
					// Marker: '/',
					Prefix: path,
				});

				if (!cancelled)
					dispatch({ type: 'success', response: result });
			} catch (error) {
				console.log('error', error, JSON.stringify(error));

				if (!cancelled)
					dispatch({ type: 'failure', error });
			}
		};

		fetchData();

		return () => { cancelled = true; };
	}, [path]);

	return <const>[state, path, setPath];
};

export default useListObjects;
