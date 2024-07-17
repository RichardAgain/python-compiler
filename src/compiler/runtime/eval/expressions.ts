import { AssigmentExpression, BinaryExp, CallExpression, Identifier, ObjectLiteral } from "../../frontend/ast"
import Enviroment from "../environment"
import { interpret } from "../interpreter"
import { RuntimeValue, NumberValue, MK_NULL, ObjectValue, NativeFunctionValue } from "../values"

export function eval_binary_expression (binary: BinaryExp, env: Enviroment): RuntimeValue {
    const left = interpret(binary.left, env)
    const right = interpret(binary.right, env)

    if (left.type == "number" && right.type == "number") {
        return eval_numeric_binary_expr(left as NumberValue, right as NumberValue, binary.operator)
    }

    return MK_NULL()
}

export function eval_numeric_binary_expr (left: NumberValue, right: NumberValue, operator: string): NumberValue {
    switch (operator) {
        case "+":
            return { type: "number", value: left.value + right.value } as NumberValue
        case "-":
            return { type: "number", value: left.value - right.value } as NumberValue
        case "*":
            return { type: "number", value: left.value * right.value } as NumberValue
        case "/":
            // TODO: Handle division by zero
            return { type: "number", value: left.value / right.value } as NumberValue
        case "%":
            return { type: "number", value: left.value % right.value } as NumberValue
        default:
            throw new Error(`Unimplemented operator: ${operator}`)
    }
}

export function eval_assigment (assigment: AssigmentExpression, env: Enviroment): RuntimeValue {
    return env.assignVariable(assigment.assigne.symbol, interpret(assigment.value, env))
}

export function eval_identifier (identifier: Identifier, env: Enviroment): RuntimeValue {
    return env.lookupVariable(identifier.symbol)
}

export function eval_object_expr (obj: ObjectLiteral, env: Enviroment): RuntimeValue {
    const object =  { type: "object", properties: new Map() } as ObjectValue

    for (const {key, value} of obj.properties) {
        object.properties.set(key, interpret(value, env))
    }

    console.log(object)

    return object
}

export function eval_call_expr (expression: CallExpression, env: Enviroment): RuntimeValue {
    const args = expression.args.map((arg) => interpret(arg, env))
    const fn = interpret(expression.calle, env)

    if (fn.type !== 'native-function') {
        throw new Error('Cannot call value that is not a function ' + JSON.stringify(fn))
    }

    let result = (fn as NativeFunctionValue).call(args, env)
    return result
}
