import React, { HTMLAttributes, InputHTMLAttributes, useRef } from 'react';

import { WithOnlyRequired } from '../helpers/typed';
import styled from 'styled-components';

const type = 'file';

// This is (an) interesting (bug)
// Need to specify 2 interfaces, the first being what you could be providing as props
// and the second one has to match what's the return.
// and it works fine - throwing an error - if `const type` is a number`
// Fun thing, it works anyway with
// const FileInput = styled.input.attrs<HTMLInputElement>({ type })
// but `const type` could literally be anything
export const HiddenFileInput = styled.input.attrs<any, Pick<HTMLInputElement, 'type'>>({ type })`
	display: none;
`;

// type PartialHTMLInputElement = Partial<HTMLInputElement>;
// These are the props that we define as mandatory, that we will intercept
// preventing them from reaching the wrapped component and pass down instead
// to our hidden input tag
export type FileInputProps = WithOnlyRequired<InputHTMLAttributes<HTMLInputElement>, 'onChange'>;

// This HOC will allow us to render a very nice button while still triggering the
// click and onChange in the real input
export const withFileInput = <P extends object>
	(Component: React.ComponentType<P>): React.FunctionComponent<Omit<P, 'onChange'> & FileInputProps> =>
	({ onChange,...props }: FileInputProps) => {
		const ref = useRef<HTMLInputElement>(void 0);

		return (
			<React.Fragment>
				<HiddenFileInput onChange={onChange} ref={ref} />
				<Component
					{...props as P}
					onClick={() => ref.current && ref.current.click()}
				/>
			</React.Fragment>
		)
	};

export default HiddenFileInput;
