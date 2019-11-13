import React, { useState } from 'react';

import styled from 'styled-components';

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
	const [uploading, dispatch] = useState<boolean>(false);

	const onFileSelected = ({ target: { files }}: React.ChangeEvent<HTMLInputElement>) => {
		if (!files.length || uploading) return;

		dispatch(true);

		// we will upload only the first one
		const [file, ...others] = Array.from(files);

		console.log("file", file);
		const fileKey = [currentPath, file.name].join('');

		// const val = s3.putObject({
		// 	Key: fileKey,
		// 	Body: file,
		// 	ACL: 'private'
		// }, function () {
		// 	console.log('Successfully uploaded');
		// }).on('httpUploadProgress', function (progress: any) {
		// 	console.log(Math.round(progress.loaded / progress.total * 100) + '% uploaded');
		// });

		const ref = setTimeout(() => dispatch(false), 2500);
		return () => clearTimeout(ref);
	};

	return (
		<ButtonWrapper>
			<label>
				<span>{'Choose a file'}</span>

				<Button
					disabled={uploading}
					onChange={onFileSelected}
				/>
			</label>
		</ButtonWrapper>
	);
};

export default UploadButton;
