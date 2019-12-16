import { makeTFArgument, makeTFListExpression } from '@src/makers';
import { printTFLiteralExpression } from '@src/printer';
import { printArgument } from '@src/printers';
import { TFNodeType } from '@src/types';
import { mocked } from 'ts-jest/utils';

jest.mock('@src/printer/printTFLiteralExpression');

describe('printArgument', () => {
  beforeEach(() =>
    mocked(printTFLiteralExpression).mockReturnValue(
      nameof(printTFLiteralExpression)
    )
  );

  it('prints the expression using printTFLiteralExpression', () => {
    expect(
      printArgument(makeTFArgument('name', '"world"'))
    ).toMatchInlineSnapshot(`"name = printTFLiteralExpression"`);
  });

  it.todo('quotes the identifier when required');

  describe('when the expression has braces', () => {
    beforeEach(() =>
      mocked(printTFLiteralExpression).mockReturnValue(
        ['{', `  ${nameof(printTFLiteralExpression)}`, '}'].join('\n')
      )
    );

    it('prints the opening brace on the first line', () => {
      expect(
        printArgument(
          makeTFArgument('name', {
            type: TFNodeType.Map,
            attributes: [
              [
                'MyArray',
                makeTFListExpression([
                  'aws_subnet.public_a.id',
                  'aws_subnet.public_b.id',
                  'aws_subnet.public_c.id'
                ])
              ]
            ]
          })
        )
      ).toMatchInlineSnapshot(`
        "name = {
          printTFLiteralExpression
        }"
      `);
    });
  });
});
