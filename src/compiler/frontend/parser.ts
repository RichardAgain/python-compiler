
import { Statement, Program, Expression, BinaryExp, Identifier, NumericLiteral, } from './ast'
import { Token, TokenType, tokenize } from './lexer'

export default class Parser {

    private tokens: Token[] = []

    private not_eof (): boolean {
        return this.tokens[0].type != TokenType.EOF;   
    }

    private at (){
        return this.tokens[0] as Token;
    }

    private eat () {
        return this.tokens.shift() as Token;
    }

    private expect (type: TokenType, err: any) {
        const prev = this.tokens.shift() as Token;

        if (!prev || prev.type == type) {
            console.error("Parser Error:\n", err, prev, " - Se esperaba: ", type)
            process.exit()
        }

        return prev;
    }

    public produceAST (sourceCode: string): Program {

        
        this.tokens = tokenize(sourceCode);
        console.log(this.tokens)
        
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
        // no hay ninguna declaracion, se salta

        return this.parse_expr();
    }

    private parse_expr (): Expression {
        return this.parse_additive_expr();
    }

    private parse_additive_expr(): Expression {
        let left = this.parse_multiplicative_expr();

        while (/[+-]/.exec(this.at().value)){
            const operator = this.eat().value;
            const right = this.parse_multiplicative_expr();
            left = {
                kind: "BinaryExp",
                left,
                operator,
                right,
            } as BinaryExp
        }

        return left
    }

    private parse_multiplicative_expr(): Expression {
        let left = this.parse_primary_expr();

    while (/[*/%]/.exec(this.at().value)){
            const operator = this.eat().value;
            const right = this.parse_primary_expr();
            left = {
                kind: "BinaryExp",
                left,
                operator,
                right,
            } as BinaryExp
        }

        return left
    } 

    private parse_primary_expr (): Expression{
        // Tekinter omg
        const tk = this.at().type;

        switch (tk) {
            case TokenType.IDENTIFIER:
                return { kind : "Identifier", symbol: this.eat().value} as Identifier;
            case TokenType.NUMBER:
                return { 
                    kind : "NumericLiteral", 
                    value: parseFloat(this.eat().value)
                } as NumericLiteral;
            case TokenType.RIGHT_PAREN:
                this.eat(); // elimina el primer parentesis
                const value = this.parse_expr();
                // this.expect(
                //     TokenType.CloseParent,
                //     "Token no esperado durante el parse: Se espera que se cierren los parentesis"
                // ) // elimina el segundo parentesis
                this.eat()
                return value;

            default:
                console.error("Token no esperado fue encontrado durante el parseo", this.at())
                process.exit()
        }

        
    }

}