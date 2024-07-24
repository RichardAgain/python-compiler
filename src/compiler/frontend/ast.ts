export type NodeType =
  // STATEMENTS
  | 'Program'
  | 'VariableDeclaration'
  | 'ExpressionDeclaration'
  | 'FunctionDeclaration'
  | 'BlockStatement'
  | 'IfStatement' 
  | 'ForStatement'
  | 'WhileStatement'
  //EXPRESSIONS
  | 'MemberExpression'
  | 'CallExpression'
  | 'AssigmentExpression'
  | 'LogicalExpression'
  | 'BinaryExp'
  // LITERALS
  | 'ObjectLiteral'
  | 'ArrayLiteral'
  | 'Property'
  | 'NumericLiteral'
  | 'StringLiteral'
  | 'Identifier'

export interface Statement {
  kind: NodeType;
}

export interface Program extends Statement {
  kind: 'Program';
  body: Statement[];
}

export interface ExpressionDeclaration extends Statement {
  kind: 'ExpressionDeclaration';
  expression: Expression;
}

export interface VariableDeclaration extends Statement {
  kind: 'VariableDeclaration';
  identifier: Identifier;
  value: Expression;
}

export interface FunctionDeclaration extends Statement {
  kind: 'FunctionDeclaration';
  identifier: Identifier;
  args: Expression[];
  body: BlockStatement;
}

export interface BlockStatement extends Statement {
    kind: "BlockStatement",
    body: Statement[],
}

export interface IfStatement extends Statement {
  kind: 'IfStatement';
  test: Expression;
  consequent: BlockStatement;
  alternate?: BlockStatement;
}

export interface ForStatement extends Statement {
  kind: 'ForStatement',
  identifier: Identifier,
  iterable: Expression,
  body: BlockStatement,
}

export interface WhileStatement extends Statement {
    kind: 'WhileStatement',
    test: Expression,
    body: BlockStatement,
}

export interface Expression extends Statement {}

export interface AssigmentExpression extends Expression {
  kind: 'AssigmentExpression';
  assigne: Identifier;
  value: Expression;
}

export interface LogicalExpression extends Expression {
  kind: 'LogicalExpression';
  operator: string;
  left: Expression;
  right: Expression;
}

export interface BinaryExp extends Expression {
  kind: 'BinaryExp';
  left: Expression;
  operator: string;
  right: Expression;
}

export interface MemberExpression extends Expression {
  kind: 'MemberExpression';
  object: Expression;
  property: Expression;
  computed: true
}

export interface CallExpression extends Expression {
  kind: 'CallExpression';
  args: Expression[];
  calle: Expression;
}

export interface Identifier extends Expression {
  kind: 'Identifier';
  symbol: string;
}

export interface NumericLiteral extends Expression {
  kind: 'NumericLiteral';
  value: number;
}

export interface StringLiteral extends Expression {
  kind: 'StringLiteral';
  value: string;
}

export interface Property extends Expression {
  kind: 'Property',
  key: Expression,
  value: Expression,
}

export interface ObjectLiteral extends Expression {
  kind: 'ObjectLiteral';
  properties: Property[];
}

export interface ArrayLiteral extends Expression { 
  kind: 'ArrayLiteral';
  elements: Expression[];
}
