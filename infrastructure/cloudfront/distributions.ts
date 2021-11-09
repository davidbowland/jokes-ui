import * as aws from '@pulumi/aws'

// https://www.pulumi.com/docs/reference/pkg/aws/cloudfront/distribution/

export const cdn = new aws.cloudfront.Distribution('ui-cdn', {
  defaultCacheBehavior: {
    allowedMethods: ['GET', 'HEAD'],
    cachePolicyId: '658327ea-f89d-4fab-a63d-7e88639e58f6', // Managed-CachingOptimized
    cachedMethods: ['GET', 'HEAD'],
    compress: true,
    defaultTtl: 0,
    fieldLevelEncryptionId: '',
    functionAssociations: [],
    lambdaFunctionAssociations: [],
    maxTtl: 0,
    minTtl: 0,
    originRequestPolicyId: '',
    realtimeLogConfigArn: '',
    smoothStreaming: false,
    targetOriginId: 'jokes-ui-source.s3.us-east-2.amazonaws.com',
    trustedKeyGroups: [],
    trustedSigners: [],
    viewerProtocolPolicy: 'redirect-to-https',
  },
  defaultRootObject: 'index.html',
  enabled: true,
  httpVersion: 'http2',
  isIpv6Enabled: true,
  origins: [
    {
      customHeaders: [],
      domainName: 'jokes-ui-source.s3.us-east-2.amazonaws.com',
      originId: 'jokes-ui-source.s3.us-east-2.amazonaws.com',
      originPath: '/jokes-ui',
    },
  ],
  priceClass: 'PriceClass_100',
  restrictions: {
    geoRestriction: {
      locations: [],
      restrictionType: 'none',
    },
  },
  retainOnDelete: false,
  viewerCertificate: {
    acmCertificateArn: '',
    cloudfrontDefaultCertificate: true,
    iamCertificateId: '',
    minimumProtocolVersion: 'TLSv1',
    sslSupportMethod: '',
  },
  waitForDeployment: true,
})
