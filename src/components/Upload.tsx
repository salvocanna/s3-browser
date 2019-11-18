import { Button, Card, Collapse, Elevation, IToaster, ProgressBar, Toaster } from '@blueprintjs/core';
import React, { useContext, useEffect, useState } from 'react';

import styled from 'styled-components';
import toasterContext from '../contexts/toaster';
import usePutObjects from '../hooks/use-put-objects';
import withFileInput from '../hocs/withFileInput';

const ButtonWrapper = styled.div`
	margin: 20px 0;
`;

const Dubugger = styled.pre`
	height: 400px;
	overflow: scroll;
`;

const NiceButtonStyled = withFileInput(Button);

const Upload: React.FunctionComponent = () => {
	const {
		state,
		submit,
		addFiles,
	} = usePutObjects();
	const [debug, setDebug] = useState(false);
	const toaster = useContext<IToaster>(toasterContext);

	useEffect(() => {
		if (state.working === void 0)
			return;

		const file = state.files.find(f => f.fileId === state.working);
		const fileState = state.filesState[state.working];

		if (!file || !fileState) return;

		toaster.show({
			icon: 'cloud-upload',
			message: (
				<div>
					{file.file.name}
					<ProgressBar
						intent={fileState.progress < 99 ? 'primary' : 'success'}
						value={fileState.progress / 100}
						animate
						stripes
					/>
				</div>
			),
			timeout: !fileState.completed ? 0 : 2000,
		}, 'uploading');
	}, [state]);

	return (
		<ButtonWrapper>
			<Card elevation={Elevation.ONE}>
				<pre>{state.status}</pre>

				<Button icon={'repeat'} onClick={() => setDebug(!debug)}>
					{'Debug: upload state'}
				</Button>

				<Collapse isOpen={debug}>
					<Dubugger>
						{JSON.stringify(state, undefined, 2)}
					</Dubugger>
				</Collapse>

				<form onSubmit={e => {
					e.preventDefault();
					submit();
				}}>
					<div>
						<NiceButtonStyled
							multiple
							onChange={e => {
								addFiles(Array.from(e.target.files));

							}}
						>
							{'Upload some files'}
						</NiceButtonStyled>
					</div>

					<div>
						<Button type={'submit'} disabled={!state.files.length}>{'Do upload!'}</Button>
					</div>

					{state.files.length > 0 && (
						<div>
							<div>{'Selected files:'}</div>
							{state.files.map(({ file, fileId }) => (
								<div key={`thumb${fileId}`} >
									<div >{file.name}</div>
								</div>
							))}
						</div>
					)}
				</form>
			</Card>
		</ButtonWrapper>
	);
};

export default Upload;
