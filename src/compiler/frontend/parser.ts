
import Enviroment from '../runtime/environment';
import { Statement, Program, Expression, BinaryExp, Identifier, NumericLiteral, AssigmentExpression, VariableDeclaration, ExpressionDeclaration, LogicalExpression, IfStatement, BlockStatement, WhileStatement, Property, ObjectLiteral, CallExpression, MemberExpression, StringLiteral, FunctionDeclaration, ForStatement, ArrayLiteral, } from './ast'
import { Token, TokenType, tokenize } from './lexer'

export default class Parser {
    env: Enviroment

    private tokens: Token[] = []

    constructor (env: Enviroment) {
        this.env = env
    }

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
            throw new Error("Parser Error:\n" + err + " - Se esperaba: " + type)
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
                    if (this.env.varibables.has(this.at().value)) {
                        return this.parse_expr_declaration()   
                    }
                    return this.parse_variable_declaration()
                } else {
                    return this.parse_expr_declaration()
                }
            case TokenType.IF:
                return this.parse_if_declaration()
            case TokenType.WHILE:
                return this.parse_while_declaration()
            case TokenType.FOR:
                return this.parse_for_declaration()
            case TokenType.FUN:
                return this.parse_function_declaration()
            default:
                return this.parse_expr_declaration();
        }       
    }

    private parse_function_declaration(): Statement {
        this.eat()
        const identifier = this.expect(TokenType.IDENTIFIER, "Se esperaba un identificador").value

        const args = this.parse_args()

        this.expect(TokenType.COLON, "Se esperaba ':'")

        return {
            kind: "FunctionDeclaration",
            identifier: { kind: "Identifier", symbol: identifier } as Identifier,
            args,
            body: this.parse_block_declaration(),
        } as FunctionDeclaration
    }

    private parse_if_declaration(): Statement {
        this.eat()

        const test = this.parse_logical_expr()
        this.expect(TokenType.COLON, 'falta los dos puntos jsjs')
        const consequent = this.parse_block_declaration()

        if (this.at().type == TokenType.ELSE) {
            this.eat()
            this.expect(TokenType.COLON, "Faltan los dos puntos")
            return {
                kind: "IfStatement",
                test,
                consequent,
                alternate: this.parse_block_declaration(),
            } as IfStatement
        }

        return {
            kind: "IfStatement",
            test,
            consequent,
        } as IfStatement
    }

    private parse_for_declaration(): Statement {
        this.eat()

        const identifier = this.expect(TokenType.IDENTIFIER, "Se esperaba un identificador").value
        this.expect(TokenType.IN, "Se esperaba 'in'")
        const iterable = this.parse_expr()
        this.expect(TokenType.COLON, "Se esperaba ':'")

        return {
            kind: "ForStatement",
            identifier: { kind: "Identifier", symbol: identifier } as Identifier,
            iterable,
            body: this.parse_block_declaration(),
        } as ForStatement
    }

    private parse_while_declaration(): Statement {
        this.eat()

        const test = this.parse_logical_expr()
        this.expect(TokenType.COLON, 'falta los dos puntos jsjs')
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
            value: this.parse_object_expr(),
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
        let left = this.parse_object_expr();

        if(this.at().type == TokenType.EQUAL) {
            if (left.kind != "Identifier") {
                throw new Error("Se esperaba un identificador")
            }

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

    private parse_object_expr (): Expression {
        
        if (this.at().type == TokenType.LEFT_BRACE) {
            this.eat()
            const properties = new Array<Property>()
    
            while (this.not_eof() && this.at().type !== TokenType.RIGHT_BRACE) {
                if (properties.length > 0) {
                    this.expect(TokenType.COMMA, "Se esperaba ','")
                }
    
                const key = this.parse_primary_expr()
                this.expect(TokenType.COLON, "Se esperaba ':'")
                const value = this.parse_expr();
                properties.push({
                    kind: "Property",
                    key,
                    value,
                } as Property)
            }
    
            this.expect(TokenType.RIGHT_BRACE, "Se esperaba '}'")
            return {
                kind: "ObjectLiteral",
                properties,
            } as ObjectLiteral

        } else if (this.at().type == TokenType.LEFT_BRACKET) {
            this.eat()
            const elements = new Array<Expression>()
    
            while (this.not_eof() && this.at().type !== TokenType.RIGHT_BRACKET) {
                if (elements.length > 0) {
                    this.expect(TokenType.COMMA, "Se esperaba ','")
                }
    
                elements.push(this.parse_expr())
            }
    
            this.expect(TokenType.RIGHT_BRACKET, "Se esperaba ']'")
            return {
                kind: "ArrayLiteral",
                elements,
            } as ArrayLiteral

        } else {
            return this.parse_logical_expr();
        }

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
        let left = this.parse_call_member_expression();

        while (/[*/%]/.exec(this.at().value)){
            const operator = this.eat().value;
            const right = this.parse_call_member_expression();
            left = {
                kind: "BinaryExp",
                left,
                operator,
                right,
            } as BinaryExp
        }

        return left
    } 

    private parse_call_member_expression(): Expression {
        const member = this.parse_member_expression();

        if (this.at().type == TokenType.LEFT_PAREN) {
            return this.parse_call_expression(member);
        }

        return member;
    }

    private parse_call_expression(calle: Expression): Expression {
        let callExpr: Expression = {
            kind: "CallExpression",
            calle,
            args: this.parse_args(),
        } as CallExpression

        if (this.at().type == TokenType.LEFT_PAREN) {
            callExpr = this.parse_call_expression(callExpr)
        }

        return callExpr
    }

    private parse_args(): Expression[] {
        this.expect(TokenType.LEFT_PAREN, "Se esperaba '('")
        const args = this.at().type == TokenType.RIGHT_PAREN 
            ? [] 
            : this.parse_args_list()

        this.expect(TokenType.RIGHT_PAREN, "Se esperaba ')'")

        return args
    }

    private parse_args_list(): Expression[] {
        const args = [this.parse_assignment_expr()]

        while (this.at().type == TokenType.COMMA && this.eat()) {
            args.push(this.parse_assignment_expr())
        }

        return args
    }

    private parse_member_expression(): Expression {
        let object = this.parse_primary_expr()

        while (this.at().type == TokenType.DOT || this.at().type == TokenType.LEFT_BRACKET){
            const operator = this.eat();
            let property: Expression;
            let computed: boolean;

            if (operator.type == TokenType.DOT) {
                property = this.parse_primary_expr();
                computed = false;
                if (property.kind != "Identifier") {
                    throw new Error("Se esperaba un identificador")
                }
            } else {
                computed = true
                property = this.parse_expr();
                this.expect(TokenType.RIGHT_BRACKET, "Se esperaba ']'")
            }

            object = {
                kind: "MemberExpression",
                object,
                property, 
                computed
            } as MemberExpression
        }

        return object
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

            case TokenType.QUOTE:
                this.eat();
                let string = "";
                while (this.at().type != TokenType.QUOTE && this.at().type != TokenType.EOF) {
                    string += this.eat().value;
                }
                this.expect(TokenType.QUOTE, "Se esperaba una comilla")
                return { 
                    kind : "StringLiteral", 
                    value: string
                } as StringLiteral;
                
            case TokenType.LEFT_PAREN:
                this.eat(); // elimina el primer parentesis
                const value = this.parse_additive_expr();
                this.expect(
                    TokenType.RIGHT_PAREN,
                    "Token no esperado durante el parse: Se espera que se cierren los parentesis"
                ) // elimina el segundo parentesis
                return value;

            default:
                throw new Error(`Token no esperado fue encontrado durante el parseo ${JSON.stringify(this.at())}`);
            }    
    }
}