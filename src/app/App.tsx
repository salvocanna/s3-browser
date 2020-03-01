import 'typeface-roboto';

import { Button, Toaster } from '@blueprintjs/core';
// import Client, { AWSConfig } from './client';
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

import { ApplicationState } from './store';
import Browser from './components/Browser';
import Credential from './components/Credential';
import Upload from './components/Upload';
import { clientActions } from './store/client';
import clientContext from './contexts/client';
import { credentialsKey } from './constants/local-storage';
// import { getItem } from './helpers/local-storage';
import styled from 'styled-components';
import toasterContext from './contexts/toaster';

// const initialCredentials = getItem<AWSConfig>(credentialsKey);

const DebugArea = styled.div`
	margin: 20px;
`;

const toaster = Toaster.create({ position: 'top' });

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
		<div className={'container-fluid'}>
			{/* <Upload /> */}
			<Browser />
			{children}

			<DebugArea>
				{/* <Button onClick={reloadConfig} icon={'refresh'}>
					{'Debug: reload config'}
				</Button> */}
			</DebugArea>
		</div>
	);
};

const compose = (contexts: [React.Context<any>, any][], children: React.ReactNode) =>
	contexts.reduce((acc: any, [context, value]) => (
		<context.Provider value={value}>{acc}</context.Provider>
	), children);

export default App;
