
import Parser from "./frontend/parser";

export const repl = (source: string) => {
    const parser = new Parser()
    const program = parser.produceAST(source)
    
    return JSON.stringify(program, null, 4)
}
