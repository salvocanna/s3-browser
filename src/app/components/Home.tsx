import React, { useEffect } from 'react';

import { actionListObjects } from '@app/store/objects/list-objects';
import { useDispatch } from 'react-redux';

const Home: React.FunctionComponent = () => {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(actionListObjects.request(void 0));
	}, []);

	return (
		<div>
			{'HOME'}
		</div>
	);
};

export default Home;
