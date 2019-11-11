import Breadcrumbs, { BreadcrumbsItem } from '@kiwicom/orbit-components/lib/Breadcrumbs';

import React from 'react';
import { getBreadcrumbItems } from '../helpers/breadcrumb';

interface BreadcrumbProps {
	path: string;
	onPathChange: (path: string) => void;
}

const Breadcrumb: React.FunctionComponent<BreadcrumbProps> = ({ path, onPathChange }) => {
	const items = getBreadcrumbItems(path);

	return (
		<Breadcrumbs>
			{items.map((item, i) => (
				<BreadcrumbsItem
					key={`${item.path}:${i}`}
					onClick={() => onPathChange(item.path)}
					href={'#'}
				>
					{item.displayName}
				</BreadcrumbsItem>
			))}
		</Breadcrumbs>
	);
};


export default Breadcrumb;
