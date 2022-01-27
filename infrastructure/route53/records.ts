import * as aws from '@pulumi/aws'

import { cdn } from '@cloudfront'
import { domainName } from '@vars'
import { zone } from './zones'

// https://www.pulumi.com/registry/packages/aws/api-docs/route53/record/

export const jokesDomain = new aws.route53.Record('jokes-domain', {
  aliases: [
    {
      evaluateTargetHealth: false,
      name: cdn.domainName,
      zoneId: cdn.hostedZoneId,
    },
  ],
  name: `jokes.${domainName}`,
  type: 'A',
  zoneId: zone.then((zone) => zone.id),
})
