import 'typeface-roboto';

import Client, { AWSConfig } from './client';
import React, { useMemo, useState } from 'react';

import Browser from './components/Browser';
import ClientContext from './contexts/client';
import Credential from './components/Credential';
import UploadButton from './components/UploadButton';
import { credentialsKey } from './constants/local-storage';
import { getItem } from './helpers/local-storage';

const initialCredentials = getItem<AWSConfig>(credentialsKey);

const App: React.FunctionComponent = () => {
	const [cred, setCred] = useState(initialCredentials);
	const builtClient = useMemo(() => {
		if (cred)
			return Client(cred);
	}, [cred]);

	const reloadConfig = () => {
		const newCred = getItem(credentialsKey);

		// We should really just trust the callback
		// TODO remove deep comparison (kind of.. stringify isn't
		// really the best way tbh)
		if (JSON.stringify(newCred) !== JSON.stringify(cred))
			setCred(newCred);
	}

	if (!builtClient)
		return <Credential onSubmit={reloadConfig} />;

	return (
		<ClientContext.Provider value={builtClient}>
			<UploadButton />
			<Browser />

			<div onClick={reloadConfig}>Reload config</div>
		</ClientContext.Provider>
	);
};

export default App;
