import { ObjectStorageClass } from 'aws-sdk/clients/s3';

export const humanizeBytes = (bytes: number) => {
	const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];

	if (bytes === 0)
		return 'n/a';

	const i = Math.floor(Math.log(bytes) / Math.log(1024));

	if (i === 0)
		return `${bytes} ${sizes[i]}`;

	return `${(bytes / (1024 ** i)).toFixed(1)} ${sizes[i]}`;
}

export const ObjectStorageClassDescription: Record<ObjectStorageClass, string> = {
	'STANDARD': 'S3 Standard',
	'REDUCED_REDUNDANCY': 'S3 Reduced Redundancy',
	'GLACIER': 'S3 Glacier',
	'STANDARD_IA': 'S3 Standard-IA',
	'ONEZONE_IA': 'S3 One Zone-IA',
	'INTELLIGENT_TIERING': 'S3 Intelligent-Tiering',
	'DEEP_ARCHIVE': 'Deep Archive',
};
