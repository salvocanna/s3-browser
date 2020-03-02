import 'typeface-roboto';
import 'typeface-montserrat';

// import { Button, Toaster } from '@blueprintjs/core';
// import Client, { AWSConfig } from './client';
import React, { useEffect, useMemo, useState } from 'react'
import { faFolder, faQuestion } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';

import { ApplicationState } from './store';
import Browser from './components/Browser';
import Credential from './components/Credential';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Reset } from 'styled-reset'
import Upload from './components/Upload';
import { clientActions } from './store/client';
import clientContext from './contexts/client';
import { credentialsKey } from './constants/local-storage';
// import { getItem } from './helpers/local-storage';
import styled from 'styled-components';
import toasterContext from './contexts/toaster';

// const initialCredentials = getItem<AWSConfig>(credentialsKey);

const MainContainer = styled.div`
	background: #F3F6F9;
	border-top: 5px #D4DFE9;

	border-top-left-radius: 50px;
	padding: 20px;
	font-family: 'Roboto';
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

	tbody {
		tr {
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

				&:hover {
					color: #37A0EA;
				}
			}
		}
	}
`;

const InnerCellAligned = styled.div`
	display: flex;
	align-items: center;
`;

const SelectedTr = styled.tr`
	td {
		background-color: #EFF7FD;
	}

	td:first-child {
		border-top-left-radius: 10px;
		border-bottom-left-radius: 10px;
	}

	td:last-child {
		border-top-right-radius: 10px;
		border-bottom-right-radius: 10px;
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


// const toaster = Toaster.create({ position: 'top' });

const App: React.FunctionComponent = ({ children }) => {
	const init = useSelector((s: ApplicationState) => s.client.init);
	const dispatch = useDispatch();

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
			<Credential onSubmit={reloadConfig} />
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
						<tr>
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
						<SelectedTr>
							<td>
								<InnerCellAligned>
									<FileTypeFolderWrap>
										<FontAwesomeIcon icon={faFolder} />
									</FileTypeFolderWrap>
									<div>
										Homework2
									</div>

								</InnerCellAligned>
							</td>
							<td>30</td>
							<td>30/12/1990</td>
							<td>481.09MB</td>
						</SelectedTr>
						<SelectedTr>
							<td>
								<InnerCellAligned>
									<FileTypeIconWrap>
										<FontAwesomeIcon icon={faQuestion} />
									</FileTypeIconWrap>
									<div>{'Homework'}</div>
								</InnerCellAligned>
							</td>
							<td>-</td>
							<td>30/12/1990</td>
							<td>481.09MB</td>
						</SelectedTr>
						<tr>
							<td>All Abc XXX</td>
							<td>-</td>
							<td>30/12/1990</td>
							<td>481.09MB</td>
						</tr>
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
