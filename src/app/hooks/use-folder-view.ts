import { Object, ObjectList } from 'aws-sdk/clients/s3';
import { useContext, useEffect, useState } from 'react';

import { AsyncState } from '@lib/redux/state';

const useFolderView = (listObjects: AsyncState<ObjectList>, currentPath: AsyncState<string>) => {
	const [objects, setObjects] = useState<Object[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (listObjects.loading || !listObjects.response || currentPath.loading) {
			setLoading(true);
			return;
		}

		const objs = getView(listObjects.response, currentPath.response);

		setObjects(objs);

		if (loading)
			setLoading(false);
	}, [listObjects, currentPath]);

	return {
		loading,
		objects,
	}
}

const keysInPath = /^[^\/]+[.]*?[\/]?$/;

const getView = (objects: Object[], path: string) => {
	console.log("getView", path);

	return objects
		.filter(o => o.Key.startsWith(path))
		.filter(o => {
			const remainingPath = o.Key.substr(path.length);
			const match = remainingPath.match(keysInPath);

			if (!match)
				return false;

			console.log('match', match);

			return true;
		});
}

export default useFolderView;
