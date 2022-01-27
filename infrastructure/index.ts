import * as pulumi from '@pulumi/pulumi'

// Import Pulumi configuration
import './config'

// Import modules to create resources
import '@cloudfront'
import '@route53'

// Output
import { cdn } from '@cloudfront'
import { jokesDomain } from '@route53'

export const cdnUrl = pulumi.interpolate`https://${cdn.domainName}`
export const url = pulumi.interpolate`https://${jokesDomain.fqdn}`
