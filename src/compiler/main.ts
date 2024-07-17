import Parser from "./frontend/parser";
import { createGlobalEnv } from "./runtime/environment";
import { interpret } from "./runtime/interpreter";

export const ast = (source: string) => {
    const env = createGlobalEnv()
    const parser = new Parser(env)

    const program = parser.produceAST(source)
    
    return JSON.stringify(program, null, 4)
}

export const repl = (source: string) => {
    const env = createGlobalEnv()
    const parser = new Parser(env)

    const program = parser.produceAST(source)
    const result = interpret(program, env)
    
    let output = '\n'
    env.output.map((item: any) => output += item.value + '\n');
    return output
}
