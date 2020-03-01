import 'typeface-roboto';

// import { Button, Toaster } from '@blueprintjs/core';
// import Client, { AWSConfig } from './client';
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

import { ApplicationState } from './store';
import Browser from './components/Browser';
import Credential from './components/Credential';
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

	font-family: 'Roboto';
	font-style: normal;
	color: #19496A;
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
			<Reset />
			{/* <Upload /> */}
			<Browser />
			{children}
		</MainContainer>
	);
};

export default App;
