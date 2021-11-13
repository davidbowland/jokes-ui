import * as pulumi from '@pulumi/pulumi'

// Import Pulumi configuration
import './config'

// Import modules to create resources
import { cdn } from '@cloudfront'

// Output

export const cdnUrl = pulumi.interpolate`https://${cdn.domainName}`
