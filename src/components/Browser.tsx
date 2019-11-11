import Breadcrumb from './Breadcrumb';
import React from 'react';
import useListObjects from '../hooks/list-objects';

const Browser: React.FunctionComponent = () => {
	const [list, path, setPath] = useListObjects('');

	return (
		<div>
			<div>The browser here</div>
			<Breadcrumb path={path} onPathChange={setPath} />

			{list.fetching && (
				<span>{'Fetching'}</span>
			)}

			{list.response && (
				<div>
					{list.response.Contents.map(i => (
						<div>Item: {i.Key}</div>
					))}
					{list.response.CommonPrefixes.map(i => (
						<div onClick={() => setPath(i.Prefix)}>Item: {i.Prefix}</div>
					))}
				</div>
			)}
		</div>
	);
};

export default Browser;
