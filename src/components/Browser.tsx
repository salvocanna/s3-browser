import Table, { TableBody, TableCell, TableHead, TableRow } from '@kiwicom/orbit-components/lib/Table';
import { faFile, faFolder } from '@fortawesome/free-solid-svg-icons'

import Breadcrumb from './Breadcrumb';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react';
import styled from 'styled-components';
import useListObjects from '../hooks/list-objects';

const Element = styled.div`
	cursor: pointer;

	> * {
		display: inline-block;
	}

	> div:first-child {
		width: 12px;
		margin-right: 8px;
	}
`;
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
							<TableRow key={i.Prefix}>
								<TableCell align={'left'}>
									<Element onClick={() => setPath(i.Prefix)}>
										<div><FontAwesomeIcon icon={faFolder} /></div>
										<div>{i.Prefix}</div>
									</Element>
								</TableCell>
							</TableRow>
						))}
						{list.response.Contents.map(i => (
							<TableRow>
								<TableCell align={'left'}>
									<Element>
										<div><FontAwesomeIcon icon={faFile} /></div>
										<div>{i.Key}</div>
									</Element>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
		</div>
	);
};

export default Browser;
