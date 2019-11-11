interface BreadcrumbItem {
	path: string;
	displayName: string;
}

export const getBreadcrumbItems = (path: string) => {
	const pieces = path
		.replace(/^\/+/, '')
		.replace(/\/+$/, '')
		.split('/');

	if (pieces[0] !== '')
		pieces.unshift('');

	const mapped: BreadcrumbItem[] = [];

	for (let i = 0; i < pieces.length; i++) {
		const value = pieces[i];
		const pathItems = pieces.slice(0, i + 1);
		let displayName = value === '' && i === 0 ? 'Root' : '';
		displayName = displayName || value || 'Unknown?';

		pathItems.push('/');

		const itemFullPath = pathItems.join('/')
			.replace(/^\/+/, '')
			.replace(/\/+$/, '/');

		mapped.push({
			displayName,
			path: itemFullPath,
		});
	}

	return mapped;
}

