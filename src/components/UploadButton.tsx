import { FileInputComponentProps, withFileInput } from '../atoms/Input';
import React, { useState } from 'react';

import styled from 'styled-components';
import usePutObjects from '../hooks/use-put-objects';

const ButtonWrapper = styled.div`
	margin: 20px;
`;

// const Button = styled.input.attrs(() => ({ type: 'file' }))`
// 	padding: 20px;
// 	font-size: 1.3rem;
// `;

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


interface NiceButtonComponentProps extends FileInputComponentProps {
	label: string;
}

const NiceButtonComponent: React.FunctionComponent<NiceButtonComponentProps> = ({ label }) => (
	<div>{`Hello m8: (${label})`}</div>
);

const NiceButtonStyled = styled.div`padding: 30px; font-size: 20px; color: red;`;

const TestComponent = withFileInput(NiceButtonComponent);
const TestStyled = withFileInput(NiceButtonStyled);

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

					<TestComponent
						multiple
						onChange={onChange}
						label={'Label goes here'}
					/>

					<TestStyled
						multiple
						onChange={onChange}
						// onClick
					>{'CLICK ME'}</TestStyled>

					{/* <input
						type="file"
						multiple
						onChange={onChange}
					/> */}
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
