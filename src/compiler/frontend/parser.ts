
import { Statement, Program, Expression, BinaryExp, Identifier, NumericLiteral, AssigmentExpression, VariableDeclaration, ExpressionDeclaration, LogicalExpression, IfStatement, BlockStatement, WhileStatement, } from './ast'
import { Token, TokenType, tokenize } from './lexer'

export default class Parser {

    private tokens: Token[] = []

    private not_eof (): boolean {
        return this.tokens[0].type != TokenType.EOF;   
    }

    private at (){
        return this.tokens[0] as Token;
    }

    private next (){
        return this.tokens[1] as Token;
    }

    private eat () {
        return this.tokens.shift() as Token;
    }

    private expect (type: TokenType, err: any) {
        const prev = this.tokens.shift() as Token;

        if (!prev || prev.type != type) {
            console.error("Parser Error:\n", err, prev, " - Se esperaba: ", type)
            process.exit()
        }

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
        switch (this.at().type) {
            case TokenType.IDENTIFIER:
                if (this.next().type == TokenType.EQUAL) {
                    return this.parse_variable_declaration();
                } else {
                    return this.parse_expr_declaration()
                }
            case TokenType.IF:
                return this.parse_if_declaration()
            case TokenType.WHILE:
                return this.parse_while_declaration()
            default:
                return this.parse_expr_declaration();
        }       
    }

    private parse_if_declaration(): Statement {
        this.eat()

        const test = this.parse_logical_expr()
        this.expect(TokenType.DOUBLE_DOT, 'falta los dos puntos jsjs')
        return {
            kind: "IfStatement",
            test,
            consequent: this.parse_block_declaration(),
        } as IfStatement

    }

    private parse_while_declaration(): Statement {
        this.eat()

        const test = this.parse_logical_expr()
        this.expect(TokenType.DOUBLE_DOT, 'falta los dos puntos jsjs')
        return {
            kind: "WhileStatement",
            test,
            body: this.parse_block_declaration(),
        } as WhileStatement
    }

    private parse_block_declaration(): Statement {
        this.expect(TokenType.IDENT, 'Falta identar')
        let body = [
            this.parse_stmt(),
        ]

        while (this.at().type == TokenType.IDENT) {
            this.eat()
            body.push(this.parse_stmt())
        }

        return {
            kind: "BlockStatement",
            body,
        } as BlockStatement
    }

    private parse_variable_declaration(): Statement {
        const identifier = this.eat().value;
        this.eat(); // elimina el "="
        return {
            kind: "VariableDeclaration",
            identifier: { kind: "Identifier", symbol: identifier } as Identifier,
            value: this.parse_additive_expr(),
        } as VariableDeclaration;
    }

    private parse_expr_declaration(): Statement {
        return {
            kind: "ExpressionDeclaration",
            expression: this.parse_expr(),
        } as ExpressionDeclaration;
    }

    private parse_expr (): Expression {
        return this.parse_assignment_expr();
    }

    private parse_assignment_expr (): Expression {
        let left = this.parse_logical_expr();

        if(this.at().type == TokenType.EQUAL) {
            this.eat();
            const right = this.parse_expr();
            left = {
                kind: "AssigmentExpression",
                assigne: left,
                value: right,
            } as AssigmentExpression
        }

        return left;
    }


    private parse_logical_expr(): Expression {
        let left = this.parse_additive_expr();

        while (this.at().type == TokenType.AND || this.at().type == TokenType.OR) {
            const operator = this.eat().value;
            const right = this.parse_additive_expr();
            left = {
                kind: "LogicalExpression",
                operator,
                left,
                right,
            } as LogicalExpression
        }

        return left
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

    private parse_primary_expr (): Expression {
        // Tekinter omg
        // 🔥🔥🔥🔥
        const tk = this.at().type;

        switch (tk) {
            case TokenType.IDENTIFIER: 
                return { 
                    kind : "Identifier", 
                    symbol: this.eat().value
                } as Identifier;
            case TokenType.NUMBER:
                return { 
                    kind : "NumericLiteral", 
                    value: parseFloat(this.eat().value)
                } as NumericLiteral;
            case TokenType.TRUE:
                return { 
                    kind : "Identifier", 
                    symbol: this.eat().value
                } as Identifier;
            case TokenType.FALSE:
                return { 
                    kind : "Identifier", 
                    symbol: this.eat().value
                } as Identifier;
            case TokenType.LEFT_PAREN:
                this.eat(); // elimina el primer parentesis
                const value = this.parse_additive_expr();
                this.expect(
                    TokenType.RIGHT_PAREN,
                    "Token no esperado durante el parse: Se espera que se cierren los parentesis"
                ) // elimina el segundo parentesis
                return value;

            default:
                console.error("Token no esperado fue encontrado durante el parseo", this.at())
                process.exit()
        }

        
    }

}