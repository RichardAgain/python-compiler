export type NodeType =
  // STATEMENTS
  | 'Program'
  | 'VariableDeclaration'
  | 'ExpressionDeclaration'
  | 'BlockStatement'
  | 'IfStatement'
  | 'WhileStatement'
  //EXPRESSIONS
  | 'NumericLiteral'
  | 'AssigmentExpression'
  | 'LogicalExpression'
  | 'Identifier'
  | 'BinaryExp';

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

export interface BlockStatement extends Statement {
    kind: "BlockStatement",
    body: Statement[],
}

export interface IfStatement extends Statement {
  kind: 'IfStatement';
  test: Expression;
  consequent: BlockStatement;
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

export interface Identifier extends Expression {
  kind: 'Identifier';
  symbol: string;
}

export interface NumericLiteral extends Expression {
  kind: 'NumericLiteral';
  value: number;
}
