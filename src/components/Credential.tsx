import React, { useContext, useState } from 'react';

import { credentialsKey } from '../constants/local-storage';
import { setItem } from '../helpers/local-storage';
import styled from 'styled-components';

const Form = styled.div`
	margin: 20px;
`;

const Input = styled.input`
	width: 150px;
	display: block;

	& + & {
		margin-top: 20px;
	}
`;

const SaveButton = styled.button``;

interface CredentialProps {
 	onSubmit: () => void;
}

const Credential: React.FunctionComponent<CredentialProps> = ({ onSubmit }) => {
	const [region, setRegion] = useState('eu-west-1');
	const [accessKeyId, setAccessKeyId] = useState('');
	const [secretAccessKey, setSecretAccessKey] = useState('');
	const [bucket, setBucket] = useState('');

	const onSaveClick = () => {
		setItem(credentialsKey, { region, accessKeyId, secretAccessKey });
		onSubmit();
	}

	return (
		<div>
			<div>{'Credential form here'}</div>
			<Form>
				<Input
					value={region}
					onChange={e => setRegion(e.target.value)}
				/>
				<Input
					value={accessKeyId}
					onChange={e => setAccessKeyId(e.target.value)}
				/>
				<Input
					value={secretAccessKey}
					onChange={e => setSecretAccessKey(e.target.value)}
				/>
				<Input
					value={bucket}
					onChange={e => setBucket(e.target.value)}
				/>

				<SaveButton
					onClick={onSaveClick}
				/>
			</Form>
		</div>
	);
};

export default Credential;
