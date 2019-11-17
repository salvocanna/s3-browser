import { Button, Card, Collapse, Elevation } from '@blueprintjs/core';
import React, { useState } from 'react';

import styled from 'styled-components';
import usePutObjects from '../hooks/use-put-objects';
import { withFileInput } from '../atoms/Input';

const ButtonWrapper = styled.div`
	margin: 20px 0;
`;

const Dubugger = styled.pre`
	height: 400px;
	overflow: scroll;
`;

const NiceButtonStyled = withFileInput(Button);

interface UploadButtonProps {
	currentPath?: string
}

const Upload: React.FunctionComponent<UploadButtonProps> = ({ currentPath }) => {
	const {
		state,
		onSubmit,
		onChange,
	} = usePutObjects();
	const [debug, setDebug] = useState(false);

	return (
		<ButtonWrapper>
			<Card elevation={Elevation.ONE}>
				{state.status === 'completed' && (
					<div>
						<h2>Done!</h2>
					</div>
				)}

				<Button icon={'repeat'} onClick={() => setDebug(!debug)}>
					{'Debug: upload state'}
				</Button>

				<Collapse isOpen={debug}>
					<Dubugger>
						{JSON.stringify(state, undefined, 2)}
					</Dubugger>
				</Collapse>


					<pre></pre>


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
			</Card>
		</ButtonWrapper>
	);
};

export default Upload;
