import { Program, VariableDeclaration } from "../../frontend/ast"
import Enviroment from "../environment"
import { interpret } from "../interpreter"
import { RuntimeValue, MK_NULL } from "../values"

export function eval_program (program: Program, env: Enviroment): RuntimeValue {
    let last: RuntimeValue = MK_NULL()

    for (const statement of program.body) {
        last = interpret(statement, env)
    }

    return last
}

export function eval_variable_declaration (declaration: VariableDeclaration, env: Enviroment): RuntimeValue {
    const value = declaration.value 
        ? interpret(declaration.value, env) 
        : MK_NULL()
    return env.declareVariable(declaration.identifier.symbol, value)
}
