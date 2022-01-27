/* General */

export const awsAccountId = process.env.AWS_ACCOUNT_ID
export const domainName = 'dbowland.com'

export const createdBy = 'jokes-ui'
export const createdFor = 'jokes'

/* CDN */

export const acmCertificateArn = `arn:aws:acm:us-east-1:${awsAccountId}:certificate/adce1a21-90b4-4120-8548-111215e582f0`
export const sourceS3Domain = 'jokes-ui-source.s3.us-east-2.amazonaws.com'
