import { RuntimeValue, NumberValue } from "./values";
import { AssigmentExpression, BinaryExp, CallExpression, ExpressionDeclaration, Identifier, NumericLiteral, ObjectLiteral, Program, Statement, VariableDeclaration } from "../frontend/ast";
import Enviroment from "./environment";
import { eval_identifier, eval_binary_expression, eval_assigment, eval_object_expr, eval_call_expr } from "./eval/expressions";
import { eval_program, eval_variable_declaration } from "./eval/statements";

export function interpret(node: Statement, env: Enviroment): RuntimeValue {
    switch (node.kind) {
        // LITERALS
        case "Identifier":
            return eval_identifier(node as Identifier, env)

        case "ObjectLiteral":
            return eval_object_expr(node as ObjectLiteral, env)

        case "NumericLiteral":
            return { value: (node as NumericLiteral).value, type: "number" } as NumberValue;
        
        // EXPRESSIONS
        case "BinaryExp":
            return eval_binary_expression(node as BinaryExp, env)

        case "AssigmentExpression":
            return eval_assigment(node as AssigmentExpression, env)

        case "CallExpression":
            return eval_call_expr(node as CallExpression, env)


        // STATEMENTS
        case "ExpressionDeclaration":
            return interpret((node as ExpressionDeclaration).expression, env)
            
        case "VariableDeclaration":
            return eval_variable_declaration(node as VariableDeclaration, env)

        // PROGRAM
        case "Program":
            return eval_program(node as Program, env)

        default:
            throw new Error(`Unimplemented node kind: ${node.kind}`)
    }
}
