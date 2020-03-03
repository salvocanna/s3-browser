import 'typeface-roboto';
import 'typeface-montserrat';

import { ApplicationState, useSelector } from './store';
import React, { useEffect, useMemo, useState } from 'react'
import { faFolder, faQuestion } from '@fortawesome/free-solid-svg-icons';

import Browser from './components/Browser';
import Credential from './components/Credential';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Reset } from 'styled-reset'
import { S3 } from 'aws-sdk';
import Upload from './components/Upload';
import { actionSelectionUpdate } from './store/browser/selection';
import { clientActions } from './store/client';
import clientContext from './contexts/client';
import { credentialsKey } from './constants/local-storage';
import styled from 'styled-components';
import toasterContext from './contexts/toaster';
import { useDispatch } from 'react-redux';

const MainContainer = styled.div`
	background: #F3F6F9;
	border-top: 5px solid #D4DFE9;

	border-top-left-radius: 50px;
	padding: 20px;
	font-family: 'Montserrat';
	font-style: normal;
	color: #19496A;
`;

const SectionName = styled.h1`
	font-family: 'Montserrat';
	font-weight: 700;

	color: #19496A;
	font-size: 22px;
	margin-bottom: 20px;
`;

const Card = styled.div`
	background-color: #FFFFFF;
	border-radius: 10px;
	box-shadow: 1px 1px 12px 1px rgba(198,217,236,0.15);
`;

const CardHeader = styled.div`
	min-height: 48px;
`;

const CardBody = styled.div`
	min-height: 48px;

	${CardHeader} + & {
		border-top: 1px solid #F7F9FB;
	}
`;


const CardTable = styled.div`
	background-color: #FFFFFF;
	border-radius: 10px;
	padding: 8px;
`;

const Table = styled.table`
	font-family: 'Montserrat';

	box-shadow: 1px 1px 12px 1px rgba(198,217,236,0.15);
	width: 100%;

	thead {
		min-height: 48px;
		border-bottom: 1px solid #F7F9FB;

		th {
			text-align: left;
			color: #547083;
			font-size: 12px;
			font-weight: 500;
			padding: 10px 10px 18px 10px;
		}
	}
`;

const InnerCellAligned = styled.div`
	display: flex;
	align-items: center;

`;

const SelectableTr = styled.tr<{ selected: boolean }>`

	cursor: pointer;

	td {
		vertical-align: middle;
		flex-direction: row;
		align-items: center;

		text-align: left;
		padding: 18px 10px;

		color: #869BA9;
		font-size: 11px;
		font-weight: 300;

		&:first-child {
			font-size: 13px;
			font-weight: 600;
			color: #19496A;
		}

		${({ selected }) => selected && `
			background-color: #EFF7FD;
			color: #37A0EA !important;
		`};

		&:first-child {
			border-top-left-radius: 10px;
			border-bottom-left-radius: 10px;
		}

		&:last-child {
			border-top-right-radius: 10px;
			border-bottom-right-radius: 10px;
		}
	}
`;

const FileTypeIconWrap = styled.div`
	display: flex;
	color: white;
	width: 30px;
	height: 30px;
	border-radius: 4px;
	background: #ececec;
	vertical-align: middle;
	margin: -5px 15px -5px 0px;
	flex-direction: row;
	justify-content: center;
	align-items: center;

	svg {
		width: 18px;
		height: 18px;
		fill: white;
	}
`;

const FileTypeFolderWrap = styled.div`
	display: flex;
	width: 30px;
	height: 30px;
	vertical-align: middle;
	margin: -5px 15px -5px 0px;

	color: #82C7F8;

	svg {
		width: 30px !important;
		height: 30px !important;
	}
`;

const Ellipsis = styled.div`
	/* overflow: hidden;
	text-overflow: ellipsis;
	width: 89%;
	white-space: nowrap;
	display: block;
	> * {
		display: inline;
	} */

	flex: 1;

	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
`;

interface SelectableRowP {
	selected: boolean;
	onSelectionChange: (selected: boolean) => void;
}


const SelectableRow: React.FunctionComponent<SelectableRowP> = ({ selected, onSelectionChange, children }) => {
	const [over, setOver] = useState(false);
	const handleSelection = () => onSelectionChange(!selected);

	return (
		<SelectableTr
			selected={over || selected}
			onMouseOver={() => setOver(true)}
			onMouseOut={() => setOver(false)}
			onClick={handleSelection}
		>
			{children}
		</SelectableTr>
	);
};

const appSelector = (state: ApplicationState) => ([
	state.client.init,
	state.objects.listObjects,
	state.browser.selection,
] as const);

const App: React.FunctionComponent = ({ children }) => {
	const [init, listObjects, selection] = useSelector(appSelector);
	const dispatch = useDispatch();
	// const [selection, setSelection] = useState<string[]>([]);

	// // TODO: have a look how to optimise this
	const reloadConfig = (region: string, accessKeyId: string, secretAccessKey: string, bucket: string) => {
		dispatch(clientActions.setCredential.request({
			region,
			accessKeyId,
			secretAccessKey,
			bucket,
		}));
	};

	if (init.loading)
		return <div>{'Loading'}</div>;

	if (!init.response) {
		return (
			<Credential
				onSubmit={reloadConfig}
			/>
		);
	}

	return (
		<MainContainer>
			<SectionName>{'My Files'}</SectionName>
			<CardTable>
				<Table>
					<thead>
						<tr>
							<th>Name</th>
							<th>Items count</th>
							<th>Last modified</th>
							<th>Size</th>
						</tr>
					</thead>
					<tbody>
						{/* <tr>
							<td>
								<InnerCellAligned>
									<FileTypeIconWrap>
										<FontAwesomeIcon icon={faQuestion} />
									</FileTypeIconWrap>
									<div>
										{'Homework'}
									</div>
								</InnerCellAligned>
							</td>
							<td>-</td>
							<td>30/12/1990</td>
							<td>130B</td>
						</tr>
						<SelectableTr>

						</SelectableTr>
						<tr>
							<td>All Abc XXX</td>
							<td>-</td>
							<td>30/12/1990</td>
							<td>481.09MB</td>
						</tr> */}
						{listObjects.response && listObjects.response.map(i => (
							<SelectableRow
								selected={selection.response && selection.response.includes(i.Key)}
								onSelectionChange={on => {
									dispatch(actionSelectionUpdate.request({type: on ? 'add' : 'remove', keys: [i.Key]}));
								}}
							>
								<td>
									<InnerCellAligned>
										<FileTypeIconWrap>
											<FontAwesomeIcon icon={faQuestion} />
										</FileTypeIconWrap>
										<Ellipsis>{i.Key.substr(0, 20)}</Ellipsis>
									</InnerCellAligned>
								</td>
								<td>-</td>
								<td>30/12/1990</td>
								<td>481.09MB</td>
							</SelectableRow>
						))}

						{/* <SelectableRow selected /> */}
					</tbody>
				</Table>
			</CardTable>
			<Reset />
			{/* <Upload /> */}
			<Browser />
			{children}
		</MainContainer>
	);
};

export default App;
