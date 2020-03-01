import { Button, Card, Collapse, Elevation, IToaster, ProgressBar, Toaster } from '@blueprintjs/core';
import React, { useContext, useEffect, useState } from 'react';

import styled from 'styled-components';
import toasterContext from '../contexts/toaster';
import withFileInput from '../hocs/withFileInput';

const ButtonWrapper = styled.div`
	margin: 20px 0;
`;

const UploadForm = styled.form`
	> * + * {
		margin-left: 10px;
	}
`;

const NiceButtonStyled = withFileInput(Button);

const Upload: React.FunctionComponent = () => {

	return <div>{'Coming soon'}</div>;
	// const {
	// 	state,
	// 	submit,
	// 	addFiles,
	// } = usePutObjects();
	// const toaster = useContext<IToaster>(toasterContext);

	// useEffect(() => {
	// 	if (state.working === void 0)
	// 		return;

	// 	const file = state.files.find(f => f.fileId === state.working);
	// 	const fileState = state.filesState[state.working];

	// 	if (!file || !fileState) return;

	// 	toaster.show({
	// 		icon: 'cloud-upload',
	// 		message: (
	// 			<div>
	// 				<span>{file.file.name}</span>
	// 				<ProgressBar
	// 					intent={fileState.completed ? 'success' : 'primary'}
	// 					value={fileState.progress / 100}
	// 					animate
	// 					stripes={!fileState.completed}
	// 				/>
	// 			</div>
	// 		),
	// 		timeout: !fileState.completed ? 0 : 2000,
	// 	}, 'uploading');
	// }, [state]);

	// const handleOnSubmit = (e: React.FormEvent) => {
	// 	e.preventDefault();
	// 	submit();
	// };

	// return (
	// 	<ButtonWrapper>
	// 		<Card elevation={Elevation.ONE}>
	// 			<UploadForm onSubmit={handleOnSubmit}>

	// 				<NiceButtonStyled
	// 					onChange={e => addFiles(Array.from(e.target.files))}
	// 				>
	// 					{'Upload one file'}
	// 				</NiceButtonStyled>

	// 				<NiceButtonStyled
	// 					mode={'multiple'}
	// 					onChange={e => addFiles(Array.from(e.target.files))}
	// 				>
	// 					{'Upload some files'}
	// 				</NiceButtonStyled>
	// 				<NiceButtonStyled
	// 					mode={'folder'}
	// 					onChange={e => addFiles(Array.from(e.target.files))}
	// 				>
	// 					{'Upload a folder'}
	// 				</NiceButtonStyled>
	// 				<Button type={'submit'} disabled={!state.files.length}>{'Do upload!'}</Button>

	// 			</UploadForm>

	// 			{/* {state.files.length > 0 && (
	// 				<div>
	// 					<div>{'Selected files:'}</div>
	// 					{state.files.map(({ file, fileId }) => (
	// 						<div key={`thumb${fileId}`} >
	// 							<div >{file.name}</div>
	// 						</div>
	// 					))}
	// 				</div>
	// 			)} */}
	// 		</Card>
	// 	</ButtonWrapper>
	// );
};

export default Upload;
