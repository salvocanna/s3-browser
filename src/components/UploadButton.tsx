import { FileInputProps, withFileInput } from '../atoms/Input';
import React, { useState } from 'react';

import styled from 'styled-components';
import usePutObjects from '../hooks/use-put-objects';

const ButtonWrapper = styled.div`
	margin: 20px;
`;

const Dubugger = styled.div`
	width: 300px;
	height: 300px;
	position: absolute;
	right: 40px;
	top: 40px;
	background: white;
	overflow: scroll;
	z-index: 9;
`;

const NiceButtonStyled = withFileInput(
	styled.div`
		cursor: pointer;
		padding: 10px 20px;
		border-radius: 8px;
		background: white;
		box-shadow: 8px 4px 15px 4px rgba(8, 8, 8, 0.08);
		font-size: 16px;
		display: inline-block;
	`
);

interface UploadButtonProps {
	currentPath?: string
}

const UploadButton: React.FunctionComponent<UploadButtonProps> = ({ currentPath }) => {
	const {
		state,
		onSubmit,
		onChange,
	} = usePutObjects();

	return (
		<ButtonWrapper>
			{state.status === 'completed' && (
				<div>
					<h2>Done!</h2>
				</div>
			)}

			<Dubugger>
				<pre>{JSON.stringify(state, undefined, 2)}</pre>
			</Dubugger>

			<form onSubmit={onSubmit}>
				<div>
					<NiceButtonStyled
						multiple
						onChange={onChange}
					>
						{'Upload some files'}
					</NiceButtonStyled>
				</div>
				<div>
					<button type="submit">Submit</button>
				</div>
				<div>
					{state.files.map(({ file, fileId }) => (
						<div key={`thumb${fileId}`} >
							<div >{file.name}</div>
						</div>
					))}
				</div>
			</form>
		</ButtonWrapper>
	);
};

export default UploadButton;
