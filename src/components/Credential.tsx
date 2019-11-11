import Card, { CardHeader, CardSection, CardSectionHeader } from '@kiwicom/orbit-components/lib/Card';
import React, { ChangeEvent, useContext, useState } from 'react';

import Button from '@kiwicom/orbit-components/lib/Button';
import InputField from "@kiwicom/orbit-components/lib/InputField";
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
	> * + * {
		margin-top: 10px;
	}
`;

const ButtonWrapper = styled.div`
	margin-top: 15px;
	width: 100px;
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
		setItem(credentialsKey, { region, accessKeyId, secretAccessKey });
		onSubmit();
	}

	return (
		<CredentialWrapper>
			<Card>
				<CardHeader
					title={'AWS S3 Credentials'}
					subTitle={'* Credentials are stored in your local storage'}
				/>
				<CardSection>
					<SpacedInputs>
						<InputField
							label={'Access Key'}
							placeholder={'AKIA...'}
							size={'small'}
							value={accessKeyId}
							onChange={(e: ChangeEvent<HTMLInputElement>) => setAccessKeyId(e.target.value)}
						/>
						<InputField
							label={'Secret'}
							size={'small'}
							value={secretAccessKey}
							onChange={(e: ChangeEvent<HTMLInputElement>) => setSecretAccessKey(e.target.value)}
						/>
						<InputField
							label={'Bucket'}
							size={'small'}
							value={bucket}
							onChange={(e: ChangeEvent<HTMLInputElement>) => setBucket(e.target.value)}
						/>
						<InputField
							label={'Region'}
							size={'small'}
							value={region}
							onChange={(e: ChangeEvent<HTMLInputElement>) => setRegion(e.target.value)}
						/>

						<ButtonWrapper>
							<Button onClick={onSaveClick} fullWidth>
								{'Save'}
							</Button>
						</ButtonWrapper>
					</SpacedInputs>

				</CardSection>
			</Card>
		</CredentialWrapper>
	);
};

export default Credential;
