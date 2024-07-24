import { BlockStatement, ForStatement, FunctionDeclaration, IfStatement, Program, VariableDeclaration, WhileStatement } from "../../frontend/ast"
import Enviroment from "../environment"
import { interpret } from "../interpreter"
import { RuntimeValue, MK_NULL } from "../values"

export function eval_program (program: Program, env: Enviroment): string {
    let last = ''

    for (const statement of program.body) {
        last += interpret(statement, env) + '\n\n'
    }

    return last
}

export function eval_variable_declaration (declaration: VariableDeclaration, env: Enviroment): string {
    return 'let ' + declaration.identifier.symbol + ' = ' + interpret(declaration.value, env)
}

export function eval_function_declaration(declaration: FunctionDeclaration, env: Enviroment): string {
    return 'function ' + declaration.identifier.symbol + '(' + declaration.args.map((arg) => interpret(arg, env)).join(', ') + ')' + eval_block_statement(declaration.body, env)
}

export function eval_block_statement (block: BlockStatement, env: Enviroment): string {
    return ' {\n\t' + block.body.map((statement) => interpret(statement, env)).join('\n\t') + '\n}'
}

export function eval_forin_statement (statement: ForStatement, env: Enviroment): string {
    return 'for (let ' + statement.identifier.symbol + ' in ' + interpret(statement.iterable, env) + ')' + eval_block_statement(statement.body, env)
}

export function eval_while_statement (statement: WhileStatement, env: Enviroment): string {
    return 'while (' + interpret(statement.test, env) + ')' + eval_block_statement(statement.body, env)
}

export function eval_if_statement (statement: IfStatement, env: Enviroment): string {
    let output = 'if (' + interpret(statement.test, env) + ')' + eval_block_statement(statement.consequent, env)

    if (statement.alternate) {
        output += ' else ' + eval_block_statement(statement.alternate, env)
    }

    return output
}
