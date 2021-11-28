import * as aws from '@pulumi/aws'

import { cdn } from '@cloudfront'
import { hostedZoneId } from '@vars'

// https://www.pulumi.com/registry/packages/aws/api-docs/route53/record/

export const jokesBowlandLink = new aws.route53.Record('jokes-bowland-link', {
  aliases: [
    {
      evaluateTargetHealth: false,
      name: cdn.domainName,
      zoneId: cdn.hostedZoneId,
    },
  ],
  name: 'jokes.bowland.link',
  type: 'A',
  zoneId: hostedZoneId,
})
