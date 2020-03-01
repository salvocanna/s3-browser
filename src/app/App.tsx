import 'typeface-roboto';
import 'typeface-montserrat';

// import { Button, Toaster } from '@blueprintjs/core';
// import Client, { AWSConfig } from './client';
import React, { useEffect, useMemo, useState } from 'react'
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
import { faQuestion } from '@fortawesome/free-solid-svg-icons';
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
			color: #536F82;
			font-size: 12px;
			padding: 10px 10px 18px 10px;
		}
	}

	tbody {
		tr {
			cursor: pointer;

			td {
				&:first-child {
					display: flex;
				}

				flex-direction: row;
				align-items: center;

				text-align: left;
				padding: 18px 10px;

				font-size: 13px;
				font-weight: 600;
				color: #19496A;

				&:hover {
					color: #37A0EA;
				}
			}
		}
	}
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

	/* display: inline-block; */
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
							<th>XXX</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>
								<FileTypeIconWrap>
									<FontAwesomeIcon icon={faQuestion} />
								</FileTypeIconWrap>
								{'Homework'}
							</td>
							<td>Homework2</td>
						</tr>
						<SelectedTr>
							<td>Homework2</td>
							<td>Homework3</td>
						</SelectedTr>
						<SelectedTr>
							<td>
								<FileTypeIconWrap>
									<FontAwesomeIcon icon={faQuestion} />
								</FileTypeIconWrap>
								{'Homework'}
							</td>
							<td>Homework2</td>
						</SelectedTr>
						<tr>
							<td>All Abc XXX</td>
							<td>All Abc XXX2</td>
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
