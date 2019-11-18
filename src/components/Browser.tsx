import { Button, Card, ContextMenu, Elevation, HTMLTable, Menu, MenuDivider, MenuItem } from "@blueprintjs/core";
import { ObjectStorageClassDescription, humanizeBytes } from '../helpers/file';
import React, { useContext } from 'react';
import { faFile, faFolder } from '@fortawesome/free-solid-svg-icons'

import Breadcrumb from './Breadcrumb';
import { Client } from '../client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import Heading from '@kiwicom/orbit-components/lib/Heading';
import S3 from 'aws-sdk/clients/s3';
import { State } from '../reducers/fetcher';
import clientContext from '../contexts/client';
import copy from 'copy-to-clipboard';
import moment from 'moment';
import styled from 'styled-components';
import useListObjects from '../hooks/use-list-objects';

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

const getSignedUrl = (client: Client, Key: string, Expires = 60 * 60 * 24) =>
	client.getSignedUrl({
		Key,
		Expires: 60 * 60 * 24,
	});

const EntryItem: React.FunctionComponent<{item: S3.Object }> = ({ item }) => {
	const client = useContext<Client>(clientContext);

	const handleContextMenu =  (e: React.MouseEvent<HTMLTableRowElement, MouseEvent>) => {
		e.preventDefault();

		ContextMenu.show(
			<Menu>
				<MenuItem
					icon={'clipboard'}
					text={'Copy pre signed URL'}
					onClick={() => getSignedUrl(client, item.Key).then(copy)}
				/>
			</Menu>,
			{ left: e.clientX, top: e.clientY },
			() => console.log('Just opened the context menu dude!', item),
		);
	};

	return (
		<tr onContextMenu={handleContextMenu}>
			<td>
				<Element>
					<div>
						<FontAwesomeIcon icon={faFile} />
					</div>
					<div>
						{item.Key}
					</div>
				</Element>

			</td>
			<td>{moment(item.LastModified).format('dddd, MMMM Do YYYY, h:mm:ss a')}</td>
			<td>{humanizeBytes(item.Size)}</td>
			<td>{ObjectStorageClassDescription[item.StorageClass]}</td>
		</tr>
	);
};


const Browser: React.FunctionComponent = () => {
	const [list, path, setPath] = useListObjects('');
	const entries = formatEntries(list);

	return (
		<UnpaddedCard elevation={Elevation.ONE}>
			<DefaultCardPaddding>
				<Breadcrumb path={path} onPathChange={setPath} />
			</DefaultCardPaddding>

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
					{entries.folders.map(item => (
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

					))}
					{entries.files.map(item => (
						<EntryItem item={item} />
					))}
				</tbody>
			</HTMLTable>
		</UnpaddedCard>
	);
};

export default Browser;
