import { AWSError, S3 } from 'aws-sdk';

import { PromiseResult } from 'aws-sdk/lib/request';

export interface AWSConfig {
	region?: string;
	apiVersion?: string;

	accessKeyId: string;
	secretAccessKey: string;
	bucket: string;
}

const defaultConfig: Partial<AWSConfig> = {
	region: 'eu-west-1',
	apiVersion: '2006-03-01',
}

export interface Client {
	listObjects: (params: Omit<S3.ListObjectsV2Request, 'Bucket'>) => Promise<PromiseResult<S3.ListObjectsV2Output, AWSError>>;
}

const getClient = (config: AWSConfig): Client => {
	const s3Client = new S3({ ...defaultConfig, ...config });

	return {
		listObjects: (params: Omit<S3.ListObjectsV2Request, 'Bucket'>) =>
			s3Client.listObjectsV2({ ...params, Bucket: config.bucket }).promise(),
	}
};

export default getClient;
