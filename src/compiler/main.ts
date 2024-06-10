
import * as fs from 'fs';
import Parser from "./frontend/parser";


const repl = (source: string) => {
    const parser = new Parser()
    const program = parser.produceAST(file)
    
    return (program)
}

const file = fs.readFileSync('./texto.txt', 'utf-8');
console.log(repl(file))
