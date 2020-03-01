import { Card, Elevation, HTMLTable } from "@blueprintjs/core";

import { ApplicationState } from '../store';
import Breadcrumb from './Breadcrumb';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Item from './Item';
import React from 'react';
import S3 from 'aws-sdk/clients/s3';
import { State } from '../reducers/fetcher';
import { faFolder } from '@fortawesome/free-solid-svg-icons'
import styled from 'styled-components';
import useListObjects from '../hooks/use-list-objects';
import { useSelector } from 'react-redux';

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

const UnpaddedCard = styled(Card)`
	padding: 0;
`;

const DefaultCardPaddding = styled.div`
	padding: 6px 12px;
`;

const formatEntries = ({ response }: State<S3.ListObjectsOutput, unknown>) => {
	if (!response)
		return { folders: [], files: [] };

	const { Prefix, CommonPrefixes, Contents } = response;

	return {
		folders: CommonPrefixes,
		files: Contents.filter(c => c.Key !== Prefix),
	};
}

const Browser: React.FunctionComponent = () => {
	// const [list, path, setPath] = useListObjects('');
	const listObjects = useSelector((s: ApplicationState) => s.objects.listObjects);

	// const entries = formatEntries(listObjects);

	return (
		<UnpaddedCard elevation={Elevation.ONE}>
			{/* <DefaultCardPaddding>
				<Breadcrumb path={path} onPathChange={setPath} />
			</DefaultCardPaddding> */}

			<HTMLTable interactive bordered striped>
				<thead>
					<tr>
						<th>{'Path'}</th>
						<th>{'Last modified'}</th>
						<th>{'Size'}</th>
						<th>{'Storage'}</th>
					</tr>
				</thead>
				<tbody>
					{/* {entries.folders.map(item => (
						<tr>
							<td>
								<Element onClick={() => setPath(item.Prefix)}>
									<div>
										<FontAwesomeIcon icon={faFolder} />
									</div>
									<div>
										{item.Prefix}
									</div>
								</Element>
							</td>
							<td>{'--'}</td>
							<td>{'--'}</td>
							<td>{'--'}</td>
						</tr>

					))} */}
					{listObjects.response && listObjects.response.map(item => (
						<Item item={item} />
					))}
				</tbody>
			</HTMLTable>
		</UnpaddedCard>
	);
};

export default Browser;
