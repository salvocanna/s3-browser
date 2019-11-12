import { ObjectStorageClassDescription, humanizeBytes } from '../helpers/file';
import Table, { TableBody, TableCell, TableHead, TableRow } from '@kiwicom/orbit-components/lib/Table';
import { faFile, faFolder } from '@fortawesome/free-solid-svg-icons'

import Breadcrumb from './Breadcrumb';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Heading from '@kiwicom/orbit-components/lib/Heading';
import { ObjectList } from 'aws-sdk/clients/s3';
import React from 'react';
import moment from 'moment';
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

			<Breadcrumb path={path} onPathChange={setPath} />

			{/* TODO find a nice solution to avoid the flickering */}
			{list.fetching && (
				<span>{'Fetching'}</span>
			)}

			{list.response && (
				<Table>
					<TableHead>
						<TableRow>
							<TableCell align={'left'}>{'Path'}</TableCell>
							<TableCell align={'left'}>{'Last modified'}</TableCell>
							<TableCell align={'left'}>{'Size'}</TableCell>
							<TableCell align={'left'}>{'Storage'}</TableCell>
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
								<TableCell align={'left'}>{'--'}</TableCell>
								<TableCell align={'left'}>{'--'}</TableCell>
								<TableCell align={'left'}>{'--'}</TableCell>
							</TableRow>
						))}

						{renderContents(list.response.Contents, list.response.Prefix)}
					</TableBody>
				</Table>
			)}
		</div>
	);
};

const renderContents = (list: ObjectList, prefix: string) => {
	const filteredList = list.filter(k => k.Key !== prefix);

	if (!filteredList.length) {
		return (
			<TableRow key={'-'}>
				<TableCell align={'left'}>
					<Heading type={'title5'}>{'Empty folder'}</Heading>
				</TableCell>
				<TableCell align={'left'}>{'--'}</TableCell>
				<TableCell align={'left'}>{'--'}</TableCell>
				<TableCell align={'left'}>{'--'}</TableCell>
			</TableRow>
		);
	}

	return filteredList.map(i => (
		<TableRow key={i.Key}>
			<TableCell align={'left'}>
				<Element>
					<div><FontAwesomeIcon icon={faFile} /></div>
					<div>{i.Key}</div>
				</Element>
			</TableCell>
			<TableCell align={'left'}>{moment(i.LastModified).format('dddd, MMMM Do YYYY, h:mm:ss a')}</TableCell>
			<TableCell align={'left'}>{humanizeBytes(i.Size)}</TableCell>
			<TableCell align={'left'}>{ObjectStorageClassDescription[i.StorageClass]}</TableCell>
		</TableRow>
	));
}

export default Browser;
