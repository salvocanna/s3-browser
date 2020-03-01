import 'typeface-roboto';

import { Button, Toaster } from '@blueprintjs/core';
// import Client, { AWSConfig } from './client';
import React, { useEffect, useMemo, useState } from 'react'

import { ApplicationState } from './store';
import Browser from './components/Browser';
import Credential from './components/Credential';
import Upload from './components/Upload';
import clientContext from './contexts/client';
import { credentialsKey } from './constants/local-storage';
// import { getItem } from './helpers/local-storage';
import styled from 'styled-components';
import toasterContext from './contexts/toaster';
import { useSelector } from 'react-redux';

// const initialCredentials = getItem<AWSConfig>(credentialsKey);

const DebugArea = styled.div`
	margin: 20px;
`;

const toaster = Toaster.create({ position: 'top' });

const App: React.FunctionComponent = ({ children }) => {
	const createClient = useSelector((s: ApplicationState) => s.client.createClient);
	// TODO HERE WE NEED TO CHECK CREDENTIAL - MAYBE

	// const [cred, setCred] = useState(initialCredentials);
	// const builtClient = useMemo(() => {
	// 	if (cred)
	// 		return Client(cred);
	// }, [cred]);

	// // TODO: have a look how to optimise this
	const reloadConfig = () => {
		// 	const newCred = getItem(credentialsKey);
		// setCred(newCred);
	};

	if (createClient.loading)
		return <div>{'Loading'}</div>;

	if (!createClient.response)
		return <Credential onSubmit={reloadConfig} />;

	return (
		<div className={'container-fluid'}>
			{/* <Upload /> */}
			{/* <Browser /> */}
			{children}

			<DebugArea>
				<Button onClick={reloadConfig} icon={'refresh'}>
					{'Debug: reload config'}
				</Button>
			</DebugArea>
		</div>
	);
};

const compose = (contexts: [React.Context<any>, any][], children: React.ReactNode) =>
	contexts.reduce((acc: any, [context, value]) => (
		<context.Provider value={value}>{acc}</context.Provider>
	), children);

export default App;
