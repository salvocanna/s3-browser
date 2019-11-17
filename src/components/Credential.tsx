import { Button, Card, Elevation, FormGroup, H4, HTMLTable, InputGroup, Text } from "@blueprintjs/core";
import React, { ChangeEvent, useContext, useState } from 'react';

import { credentialsKey } from '../constants/local-storage';
import { setItem } from '../helpers/local-storage';
import styled from 'styled-components';

const CredentialWrapper = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	height: 100vh;

	> * {
		max-width: 400px;
		flex: 1;
	}
`;

const SpacedInputs = styled.div`
	margin-top: 20px;

	> * + * {
		margin-top: 10px;
	}
`;

const ButtonWrapper = styled.div`
	margin-top: 15px;
	width: 80px;
	margin-left: auto;
`;

interface CredentialProps {
	onSubmit: () => void;
}

const Credential: React.FunctionComponent<CredentialProps> = ({ onSubmit }) => {
	const [region, setRegion] = useState('eu-west-1');
	const [accessKeyId, setAccessKeyId] = useState('');
	const [secretAccessKey, setSecretAccessKey] = useState('');
	const [bucket, setBucket] = useState('');

	const onSaveClick = () => {
		// Shouldn't really blindly trust the user input
		// TODO need validation and a feedback loop
		setItem(credentialsKey, { region, accessKeyId, secretAccessKey, bucket });
		onSubmit();
	}

	return (
		<CredentialWrapper>
			<Card elevation={Elevation.ONE}>
				<H4>{'AWS S3 Credentials'}</H4>
				<Text>{'* Credentials are stored in your local storage'}</Text>

				<SpacedInputs>
					<FormGroup
						label={'Access Key'}
						labelInfo="(required)"
					>
						<InputGroup
							placeholder={'AKIA...'}
							value={accessKeyId}
							onChange={(e: ChangeEvent<HTMLInputElement>) => setAccessKeyId(e.target.value)}
						/>
					</FormGroup>

					<FormGroup
						label={'Secret'}
						labelInfo="(required)"
					>
						<InputGroup
							value={secretAccessKey}
							onChange={(e: ChangeEvent<HTMLInputElement>) => setSecretAccessKey(e.target.value)}
						/>
					</FormGroup>

					<FormGroup
						label={'Bucket'}
						labelInfo="(required)"
					>
						<InputGroup
							value={bucket}
							onChange={(e: ChangeEvent<HTMLInputElement>) => setBucket(e.target.value)}
						/>
					</FormGroup>

					<FormGroup label={'Region'}>
						<InputGroup
							value={region}
							onChange={(e: ChangeEvent<HTMLInputElement>) => setRegion(e.target.value)}
						/>
					</FormGroup>

					<ButtonWrapper>
						<Button
							onClick={onSaveClick}
							intent={'primary'}
							text={'Save'}
							fill
						/>
					</ButtonWrapper>
				</SpacedInputs>
			</Card>
		</CredentialWrapper>
	);
};

export default Credential;
