import React, { useState } from 'react';

import styled from 'styled-components';

const ButtonWrapper = styled.div`
	margin: 20px;
`;

const Button = styled.button`
	padding: 20px;
	font-size: 1.3rem;
`;

interface UploadButtonProps {
	currentPath?: string
}

const UploadButton: React.FunctionComponent<UploadButtonProps> = ({ currentPath }) => {
	const [uploading, dispatch] = useState<boolean>(false);

	const beginUpload = () => {
		if (uploading) return;

		dispatch(true);

		const ref = setTimeout(() => dispatch(false), 2500);
		return () => clearTimeout(ref);
	};

	return (
		<ButtonWrapper>
			<Button
				disabled={uploading}
				onClick={beginUpload}
			>{uploading ? 'Uploading...' : 'Upload new file'}</Button>
		</ButtonWrapper>
	);
};

export default UploadButton;
