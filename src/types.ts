import { AwsResourceType } from '@src/utils';

export enum TFNodeType {
  Body = 'body',
  List = 'list',
  Argument = 'argument',
  Function = 'function',
  Simple = 'simple',
  Block = 'block',
  Label = 'label',
  Map = 'map'
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface TFBaseNode {
  //
}

export interface TFSimpleLiteral extends TFBaseNode {
  type: TFNodeType.Simple;
  value: string;
  // value:
  //   | string //
  //   | number
  //   | boolean
  //   | null;
  surroundingText: SurroundingOuterText;
}

export interface TFMapLiteral extends TFBaseNode {
  type: TFNodeType.Map;
  attributes: Array<[string, TFLiteralExpression]>;
}

export interface SurroundingInnerText {
  leadingInnerText: string;
  trailingInnerText: string;
}

export interface SurroundingOuterText {
  leadingOuterText: string;
  trailingOuterText: string;
}

export type SurroundingText = SurroundingInnerText & SurroundingOuterText;

export interface TFLabel<TValue extends string = string> {
  type: TFNodeType.Label;
  value: TValue;
  surroundingText: SurroundingOuterText;
}

export interface TFListExpression extends TFBaseNode {
  type: TFNodeType.List;
  values: TFLiteralExpression[];
  hasTrailingComma: boolean;
  surroundingText: SurroundingText;
}

export type TFLiteralExpression =
  | TFSimpleLiteral
  | TFFunctionCall
  | TFListExpression
  | TFMapLiteral;

interface TFFunctionCall extends TFBaseNode {
  type: TFNodeType.Function;
  name: string;
  args: unknown[];
}

export interface TFArgument<TIdentifier extends string = string>
  extends TFBaseNode {
  type: TFNodeType.Argument;
  identifier: TIdentifier;
  expression: TFLiteralExpression;
  surroundingText: SurroundingInnerText;
}

export type TFBlockBodyElement<TIdentifier extends string = string> =
  | TFArgument<TIdentifier>
  | TFBlock
  | TFDynamicBlock;

export type TFBlockBodyBody<TIdentifier extends string = string> = Array<
  TFBlockBodyElement<TIdentifier>
>;

export interface TFBlockBody<TIdentifier extends string = string> {
  type: TFNodeType.Body;
  body: TFBlockBodyBody<TIdentifier>;
  surroundingText: SurroundingText;
}

export enum RandomResourceType {
  RandomString = 'random_string',
  RandomPet = 'random_pet',
  RandomId = 'random_id'
}

export type ResourceType =
  | AwsResourceType //
  | RandomResourceType
  | string;

export type TFTopLevelBlock = TFResourceBlock | TFModuleBlock;

/** The AST for a valid Terraform file. */
export type TFFileAST = TFTopLevelBlock[];

/**
 * A Terraform module, made up of ASTs of the files in the module.
 * Note that a "module" is different from a "module block".
 */
interface TFModule {
  files: { [K: string]: TFFileAST };
}

export interface TFResourceBlock<TIdentifier extends string = string>
  extends TFBlock<TIdentifier> {
  blockType: 'resource';
  labels: [TFLabel<ResourceType>, TFLabel];
}

export interface TFBlock<TIdentifier extends string = string>
  extends TFBaseNode {
  type: TFNodeType.Block;
  blockType: string;
  labels: TFLabel[];
  body: TFBlockBody<TIdentifier>;
  surroundingText: SurroundingOuterText;
}

export interface TFDynamicBlock<TIdentifier extends string = string>
  extends TFBlock<TIdentifier | 'content' | 'for_each' | 'iterator'> {
  blockType: 'dynamic';
  labels: [TFLabel];
}

export interface TFModuleBlock<TIdentifier extends string = string>
  extends TFBlock<TIdentifier | 'source'> {
  blockType: 'module';
  labels: [TFLabel];
}
