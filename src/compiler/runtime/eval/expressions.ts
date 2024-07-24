import { ArrayLiteral, AssigmentExpression, BinaryExp, CallExpression, Identifier, LogicalExpression, MemberExpression, ObjectLiteral } from "../../frontend/ast"
import Enviroment from "../environment"
import { interpret } from "../interpreter"
import { RuntimeValue, NumberValue, MK_NULL, ObjectValue, NativeFunctionValue } from "../values"

export function eval_binary_expression (binary: BinaryExp, env: Enviroment): string {
    return interpret(binary.left, env) + ' ' + binary.operator + ' ' + interpret(binary.right, env)
}

export function eval_logical_expression (binary: LogicalExpression, env: Enviroment): string {
    let opertator = (binary.operator === 'and') ? '&&' : '||'

    return interpret(binary.left, env) + ' ' + opertator + ' ' + interpret(binary.right, env)

}

export function eval_assigment (assigment: AssigmentExpression, env: Enviroment): string {
    return assigment.assigne.symbol + ' = ' + interpret(assigment.value, env)
}

export function eval_identifier (identifier: Identifier, env: Enviroment): string {
    return (identifier.symbol == 'print') ? 'console.log' : identifier.symbol
}

export function eval_object_expr (obj: ObjectLiteral, env: Enviroment): string {
    return '{' + obj.properties.map((prop) => interpret(prop.key, env) + ': ' + interpret(prop.value, env)).join(', ') + '}'
}

export function eval_array_expr (array: ArrayLiteral, env: Enviroment): string {
    return '[' + array.elements.map((element) => interpret(element, env)).join(', ') + ']'
}

export function eval_call_expr (expression: CallExpression, env: Enviroment): string {
    const args = expression.args.map((arg) => interpret(arg, env)).join(', ')
    return interpret(expression.calle, env) + '(' + args + ')'
}

export function eval_member_expr (member: MemberExpression, env: Enviroment): string {
    return interpret(member.object, env) + '[' + interpret(member.property, env) + ']'
}
