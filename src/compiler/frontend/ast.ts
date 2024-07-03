
export type NodeType = 
    | "Program"
    | "NumericLiteral"
    | "Identifier"
    | "BinaryExp"
    
export interface Statement {
    kind: NodeType
}

export interface Program extends Statement {
    kind: "Program"
    body: Statement[]
}

export interface Expression extends Statement {}

// export interface VariableDeclaration extends Expression {
//     kind: "VariableDeclaration"
//     assigne: Expression
//     value: Expression

// }

export interface BinaryExp extends Expression {
    kind: "BinaryExp"
    left: Expression
    operator: string
    right: Expression
}

export interface Identifier extends Expression {
    kind: "Identifier"
    symbol: string
}

export interface NumericLiteral extends Expression {
    kind: "NumericLiteral"
    value: number
}
