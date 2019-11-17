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
import styled from 'styled-components';

const initialCredentials = getItem<AWSConfig>(credentialsKey);

const DebugArea = styled.div`
	margin: 20px;
`;

const App: React.FunctionComponent = () => {
	const [cred, setCred] = useState(initialCredentials);
	const builtClient = useMemo(() => {
		if (cred)
			return Client(cred);
	}, [cred]);

	const reloadConfig = () => {
		const newCred = getItem(credentialsKey);

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
				<Browser />
			</div>

			<DebugArea>
				<Button
					onClick={reloadConfig}
					icon={'refresh'}
				>
					{'Debug: reload config'}
				</Button>
			</DebugArea>
		</ClientContext.Provider>
	);
};

export default App;
