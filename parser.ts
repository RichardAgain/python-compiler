import { ScriptSnapshot, disposeEmitNodes } from 'typescript';
import { Statement, Program, Expression, BinaryExp, Identifier, NumericLiteral, } from './frontend/ast.ts'
import { Token, Tokentype, tokenize } from './frontend/lexer.ts'
import { Script } from 'vm';

export default class Parser {

    private tokens: Token[] = []

    private not_eof (): boolean{
        return this.tokens[0].type != Tokentype.EOF;   
    }

    private at (){
        return this.tokens[0] as Token;
    }

    private eat () {
        const prev = this.tokens.shift() as Token;
        return prev;
    }

    public produceAST (sourceCode: string): Program {

        this.tokens = tokenize(sourceCode);

        const program: Program = {
            kind: "Program",
            body: [],
        };


        // analizar gramaticalmente hasta el final del archivo
        while(this.not_eof()){
            program.body.push(this.parse_stmt());
        }

        return program;
    }

    private parse_stmt (): Statement {
        return this.parse_stmt();
    }

    private parse_expr (): Expression {
        return this.parse_primary_expr();
    }

    private parse_primary_expr (): Expression{
        // Tekinter omg
        const tk = this.at().type;

        switch (tk) {
            case Tokentype.Identifier:
                return { kind : "Identifier", symbol: this.eat().value} as Identifier;
            case Tokentype.Number:
                return { kind : "NumericLiteral", value: parseFloat(this.eat().value)} as NumericLiteral;

                default:
                    console.error("Unexpected token found during parsing!", this.at())
                    globalThis.exit(1);  
                    return      
        }

        
    }

}