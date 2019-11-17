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

interface PutObjectRequestPayload extends Omit<S3.PutObjectRequest, 'Bucket'> {
	onProgress: (progress: any) => void;
}

export interface Client {
	listObjects: (params: Omit<S3.ListObjectsV2Request, 'Bucket'>) => Promise<PromiseResult<S3.ListObjectsV2Output, AWSError>>;
	putObject: (params: PutObjectRequestPayload) => Promise<S3.PutObjectOutput>;
}

const getClient = (config: AWSConfig): Client => {
	const s3Client = new S3({ ...defaultConfig, ...config });

	return {
		listObjects: (params: Omit<S3.ListObjectsV2Request, 'Bucket'>) =>
			s3Client.listObjectsV2({ ...params, Bucket: config.bucket }).promise(),
		putObject: ({ onProgress, ...params }: PutObjectRequestPayload) =>
			new Promise((resolve: (data: S3.PutObjectOutput) => void, reject: (data: AWSError) => void) => {
				s3Client.putObject({
					...params,
					Bucket: config.bucket,
				}, (err: AWSError, data: S3.PutObjectOutput) => {
					if (err)
						return reject(err);

					return resolve(data);
				})
					.on('httpUploadProgress', function (progress: any) {
						onProgress(progress);
					});
		}),
	}
};

export default getClient;
