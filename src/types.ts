import { AwsResourceType } from '@src/utils';

export enum TFNodeType {
  Resource = 'resource',
  Dynamic = 'dynamic',
  Argument = 'argument',
  Function = 'function',
  Block = 'block',
  Map = 'map'
}

export type TFPrimitiveLiteral =
  | string //
  | number
  | boolean
  | null;

export interface TFMapLiteral {
  type: TFNodeType.Map;
  attributes: Array<[string, TFLiteralExpression]>;
}

export type TFLiteralExpression =
  | TFPrimitiveLiteral // todo: replace w/ Node
  | TFFunctionCall
  | TFLiteralExpression[] // todo: replace w/ Node
  | TFMapLiteral;

interface TFFunctionCall {
  type: TFNodeType.Function;
  name: string;
  args: unknown[];
}

export interface TFArgument<TIdentifier extends string = string> {
  type: TFNodeType.Argument;
  identifier: TIdentifier;
  expression: TFLiteralExpression;
}

export interface TFBlockLiteral<TIdentifier extends string = string> {
  type: TFNodeType.Block;

  /**
   * The name of the block literal
   */
  name: string;
  /**
   * The arguments that make up the resource.
   */
  body: TFBlockBody<TIdentifier>;
}

export interface TFDynamicBlock<TIdentifier extends string = string> {
  type: TFNodeType.Dynamic;
  /**
   * The label of the dynamic block, which specifies what kind of nested block to generate.
   */
  name: string;
  content: TFBlockBody<TIdentifier>;
  labels: string[];
  forEach: unknown;
  /**
   * Sets the name of a temporary variable that represents the current element of the complex value.
   * If omitted, the name of the variable defaults to the label of the dynamic block.
   */
  iterator?: string;
}

export type TFBlockBodyElement<TIdentifier extends string = string> =
  | TFArgument<TIdentifier>
  | TFBlockLiteral
  | TFDynamicBlock;

export type TFBlockBody<TIdentifier extends string = string> = Array<
  TFBlockBodyElement<TIdentifier>
>;

export enum RandomResourceType {
  RandomString = 'random_string',
  RandomPet = 'random_pet',
  RandomId = 'random_id'
}

export type ResourceType =
  | AwsResourceType //
  | RandomResourceType
  | string;

export type TFTopLevelBlock = TFResourceBlock;

/** The AST for a valid Terraform file. */
export type TFFileAST = TFTopLevelBlock[];

/**
 * A Terraform module, made up of ASTs of the files in the module.
 * Note that a "module" is different from a "module block".
 */
interface TFModule {
  files: { [K: string]: TFFileAST };
}

export interface TFResourceBlock<TIdentifier extends string = string> {
  type: TFNodeType.Resource;
  /**
   * The type of this resource.
   */
  resource: ResourceType;
  /**
   * The name of this resource.
   */
  name: string;
  /**
   * The body of this resource block.
   */
  body: TFBlockBody<TIdentifier>;
}
