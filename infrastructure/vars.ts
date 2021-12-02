/* General */

export const awsAccountId = process.env.AWS_ACCOUNT_ID

export const createdBy = 'jokes-ui'
export const createdFor = 'dbowland-jokes'

/* CDN */

export const acmCertificateArn = `arn:aws:acm:us-east-1:${awsAccountId}:certificate/7f4606f7-302c-40a8-ac9d-e63db9b7a712`
export const sourceS3Domain = 'jokes-ui-source.s3.us-east-2.amazonaws.com'

/* Route 53 */

export const hostedZoneId = 'Z01312547RGU1BYKIJXY'
