import Table, { TableBody, TableCell, TableHead, TableRow } from '@kiwicom/orbit-components/lib/Table';

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
				<Table>
					<TableHead>
						<TableRow>
							<TableCell align={'left'}>{'Path'}</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{list.response.CommonPrefixes.map(i => (
							<TableRow>
								<TableCell align={'left'}>
									<span onClick={() => setPath(i.Prefix)}>
										Folder: {i.Prefix}
									</span>
								</TableCell>
							</TableRow>
						))}
						{list.response.Contents.map(i => (
							<TableRow>
								<TableCell align={'left'}>Item: {i.Key}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
		</div>
	);
};

export default Browser;
