import { RuntimeValue, NumberValue } from "./values";
import { ArrayLiteral, AssigmentExpression, BinaryExp, BlockStatement, CallExpression, ExpressionDeclaration, ForStatement, FunctionDeclaration, Identifier, IfStatement, LogicalExpression, MemberExpression, NumericLiteral, ObjectLiteral, Program, Statement, StringLiteral, VariableDeclaration, WhileStatement } from "../frontend/ast";
import Enviroment from "./environment";
import { eval_identifier, eval_binary_expression, eval_assigment, eval_object_expr, eval_call_expr, eval_logical_expression, eval_array_expr, eval_member_expr } from "./eval/expressions";
import { eval_block_statement, eval_forin_statement, eval_function_declaration, eval_if_statement, eval_program, eval_variable_declaration, eval_while_statement } from "./eval/statements";

export function interpret(node: Statement, env: Enviroment): string {
    switch (node.kind) {
        // LITERALS
        case "Identifier":
            return eval_identifier(node as Identifier, env)

        case "ObjectLiteral":
            return eval_object_expr(node as ObjectLiteral, env)

        case "ArrayLiteral":
            return eval_array_expr(node as ArrayLiteral, env)

        case "NumericLiteral":
            return (node as NumericLiteral).value.toString()

        case "StringLiteral":
            return '"' + (node as StringLiteral).value.toString() + '"'
        
        // EXPRESSIONS
        case "BinaryExp":
            return eval_binary_expression(node as BinaryExp, env)

        case "LogicalExpression":
            return eval_logical_expression(node as LogicalExpression, env)

        case "AssigmentExpression":
            return eval_assigment(node as AssigmentExpression, env)

        case "CallExpression":
            return eval_call_expr(node as CallExpression, env)

        case "MemberExpression":
            return eval_member_expr(node as MemberExpression, env)


        // STATEMENTS
        case "ExpressionDeclaration":
            return interpret((node as ExpressionDeclaration).expression, env)
            
        case "VariableDeclaration":
            return eval_variable_declaration(node as VariableDeclaration, env)

        case "FunctionDeclaration":
            return eval_function_declaration(node as FunctionDeclaration, env)

        case "BlockStatement":
            return eval_block_statement(node as BlockStatement, env)

        case "IfStatement":
            return eval_if_statement(node as IfStatement, env)

        case "ForStatement":
            return eval_forin_statement(node as ForStatement, env)
        
        case "WhileStatement":
            return eval_while_statement(node as WhileStatement, env)

        // PROGRAM
        case "Program":
            return eval_program(node as Program, env)

        default:
            throw new Error(`Unimplemented node kind: ${node.kind}`)
    }
}
