import 'typeface-roboto';

import Client, { AWSConfig } from './client';
import React, { useMemo, useState } from 'react';

import Browser from './components/Browser';
import { Button } from '@blueprintjs/core';
import ClientContext from './contexts/client';
import Credential from './components/Credential';
import Upload from './components/Upload';
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
			<div className={'container-fluid'}>
				<span>{'Upload area'}</span>
				<Upload />
			</div>
			<div className={'container-fluid'}>
				{/* <Button onClick={reloadConfig}>{'Reload config'}</Button> */}
				<Browser />
			</div>

		</ClientContext.Provider>
	);
};

export default App;
