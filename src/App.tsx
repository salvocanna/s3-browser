import 'typeface-roboto';

import Client, { AWSConfig } from './client';
import React, { useMemo, useState } from 'react';

import Browser from './components/Browser';
import ClientContext from './contexts/client';
import Credential from './components/Credential';
import { credentialsKey } from './constants/local-storage';
import { getItem } from './helpers/local-storage';

const initialCredentials = getItem<AWSConfig>(credentialsKey);

const App: React.FunctionComponent = () => {
	const [cred, setCred] = useState(initialCredentials);
	const builtClient = useMemo(() => {
		if (!cred)
			return;

		console.warn("creating new client");

		return Client(cred);
	}, [cred]);

	const reloadConfig = () => {
		const newCred = getItem(credentialsKey);

		if (JSON.stringify(newCred) !== JSON.stringify(cred))
			setCred(newCred);
	}

	if (!builtClient)
		return <Credential onSubmit={reloadConfig} />;

	return (
		<ClientContext.Provider value={builtClient}>
			<Browser />

			<div onClick={reloadConfig}>Reload config</div>
		</ClientContext.Provider>
	);
};

export default App;
