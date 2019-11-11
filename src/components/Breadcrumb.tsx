import React from 'react';
import { getBreadcrumbItems } from '../helpers/breadcrumb';

interface BreadcrumbProps {
	path: string;
	onPathChange: (path: string) => void;
}

const Breadcrumb: React.FunctionComponent<BreadcrumbProps> = ({ path, onPathChange }) => {
	const items = getBreadcrumbItems(path);

	return (
		<div>
			{items.map((item, i) => (
				<span key={`${item.path}:${i}`} onClick={() => onPathChange(item.path)}>
					{item.displayName}{' / '}
				</span>
			))}
		</div>
	);
};


export default Breadcrumb;
