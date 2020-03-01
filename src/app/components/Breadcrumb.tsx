import { BreadcrumbItem, getBreadcrumbItems } from '../helpers/breadcrumb';
import { Breadcrumbs, IBreadcrumbProps } from "@blueprintjs/core";

import React from 'react';

type PathChangeCallback = (path: string) => void;

interface BreadcrumbProps {
	path: string;
	onPathChange: PathChangeCallback;
}

const map = (item: BreadcrumbItem, onPathChange: PathChangeCallback): IBreadcrumbProps => ({
	text: item.displayName,
	onClick: () => onPathChange(item.path),
});

const Breadcrumb: React.FunctionComponent<BreadcrumbProps> = ({ path, onPathChange }) => (
	<Breadcrumbs
		items={getBreadcrumbItems(path).map(i => map(i, onPathChange))}
	/>
);

export default Breadcrumb;
