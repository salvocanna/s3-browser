import React, { useState } from 'react';

import styled from 'styled-components';
import usePutObjects from '../hooks/use-put-objects';

const ButtonWrapper = styled.div`
	margin: 20px;
`;

const Button = styled.input.attrs(() => ({ type: 'file' }))`
	padding: 20px;
	font-size: 1.3rem;
`;

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

			<div>
				<pre>{JSON.stringify(state, undefined, 2)}</pre>
			</div>

			<form onSubmit={onSubmit}>
				<div>
					<input
						type="file"
						multiple
						onChange={onChange}
					/>
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
