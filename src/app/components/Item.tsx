import { Button, Card, ContextMenu, Elevation, HTMLTable, Menu, MenuDivider, MenuItem } from "@blueprintjs/core";
import { ObjectStorageClassDescription, humanizeBytes } from '../helpers/file';
import React, { useContext } from 'react';

import { Client } from '../client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import Heading from '@kiwicom/orbit-components/lib/Heading';
import S3 from 'aws-sdk/clients/s3';
import { State } from '../reducers/fetcher';
import clientContext from '../contexts/client';
import copy from 'copy-to-clipboard';
import { faFile } from '@fortawesome/free-solid-svg-icons'
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

const getSignedUrl = (client: Client, Key: string, Expires = 60 * 60 * 24) =>
	client.getSignedUrl({ Key, Expires });

const oneHour = 60 * 60;

const Item: React.FunctionComponent<{ item: S3.Object }> = ({ item }) => {
	const client = useContext<Client>(clientContext);

	const handleContextMenu = (e: React.MouseEvent<HTMLTableRowElement, MouseEvent>) => {
		const position = { left: e.clientX, top: e.clientY };
		e.preventDefault();

		ContextMenu.show(
			<Menu>
				<MenuItem
					icon={'clipboard'}
					text={'Copy pre-signed URL (1h)'}
					onClick={() => copy(getSignedUrl(client, item.Key, oneHour * 24))}
				/>
				<MenuItem
					icon={'clipboard'}
					text={'Copy pre-signed URL (24h)'}
					onClick={() => copy(getSignedUrl(client, item.Key, oneHour))}
				/>
			</Menu>,
			position,
			() => console.log('Just opened the context menu dude!', item),
			true,
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


export default Item;
