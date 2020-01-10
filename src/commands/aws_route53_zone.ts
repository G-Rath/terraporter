import { Command, flags } from '@oclif/command';
import * as Parser from '@oclif/parser';
import { nadoRoute53Zone } from '@src/nados';
import { TFNodeType, TFResourceBlock } from '@src/types';
import { AwsResourceType } from '@src/utils';

export default class AwsRoute53Zone extends Command {
  public static description =
    'Generates Terraform configuration for a Route53 Zone';

  public static examples = [
    `$ terraport aws_route53_zone /hostedzone/123456789
hello world from ./src/hello.ts!
`
  ];

  public static flags = {
    greedy: flags.boolean({
      description:
        'if true, will greedily nado configuration for related resources, such as records',
      default: false,
      char: 'g'
    })
  };

  public static args: Parser.args.IArg[] = [
    { name: 'zoneId', required: true } //
  ];

  public async run() {
    const {
      args: { zoneId },
      flags: { greedy }
    } = this.parse(AwsRoute53Zone);

    console.log(
      `Preparing to port "${zoneId}", with${greedy ? '' : 'out'} records`
    );
    const tfRoot = await nadoRoute53Zone(zoneId, greedy);

    const zoneResource = tfRoot.find(
      (block): block is TFResourceBlock =>
        block.type === TFNodeType.Block &&
        block.blockType === 'resource' &&
        block.labels[0].value === AwsResourceType.AWS_ROUTE53_ZONE
    );

    if (!zoneResource) {
      throw new Error('assertion failure: "zoneResource" cannot be undefined');
    }

    const fileName = `route_${zoneResource.labels[1].value}`;

    console.log(fileName);
  }
}
