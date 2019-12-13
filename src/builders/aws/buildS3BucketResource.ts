import { makeTFResourceBlock, makeTFStringArgument } from '@src/makers';
import { TFBlockBodyBody, TFResourceBlock } from '@src/types';
import { asResourceName, AwsResourceType } from '@src/utils';

export type TFS3BucketResource =
  | TFS3BucketResourceWithName
  | TFS3BucketResourceWithNamePrefix;

type CannedACL =
  | 'private'
  | 'public-read'
  | 'public-read-write'
  | 'aws-exec-read'
  | 'authenticated-read'
  | 'bucket-owner-read'
  | 'bucket-owner-full-control'
  | 'log-delivery-write';

interface TFS3BucketResourceBase {
  acl: CannedACL;
  website: never;
  cors_rules: never;
  versioning: never;
  logging: never;
}

interface TFS3BucketResourceWithName extends TFS3BucketResourceBase {
  bucket: string;
  bucket_name?: undefined;
}

interface TFS3BucketResourceWithNamePrefix extends TFS3BucketResourceBase {
  bucket?: undefined;
  bucket_name: string;
}

export interface S3BucketSettings {
  BucketName: string;
}

/**
 * Builds an S3 Bucket Terraform resource.
 *
 * @param {S3BucketSettings} s3Bucket
 *
 * @return {TFResourceBlock<keyof TFS3BucketResource>}
 *
 * @todo support `website`
 * @todo support `versioning`
 * @todo support `acl`
 * @todo support `cors_rule`
 * @todo support `logging`
 * @todo support `server_side_encryption_configuration`
 * @todo support `replication_configuration`
 * @todo support policy
 *
 * @todo support `lifecycle_rule`
 */
export const buildS3BucketResource = (
  s3Bucket: S3BucketSettings
): TFResourceBlock<keyof TFS3BucketResource> => {
  const body: TFBlockBodyBody<keyof TFS3BucketResource> = [
    makeTFStringArgument('bucket', s3Bucket.BucketName)
  ];

  return makeTFResourceBlock(
    asResourceName(s3Bucket.BucketName),
    AwsResourceType.AWS_S3_BUCKET,
    body
  );
};
