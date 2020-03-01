import React, { useEffect } from 'react';

import { objectsActions } from '../store/objects';
import { useDispatch } from 'react-redux';

const Home: React.FunctionComponent = () => {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(objectsActions.listObjects.request(void 0));
	}, []);

	return (
		<div>
			{'HOME'}
		</div>
	);
};

export default Home;
