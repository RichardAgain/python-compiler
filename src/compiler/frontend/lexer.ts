
export enum TokenType {
    LEFT_PAREN = "LEFT_PAREN",
    RIGHT_PAREN = "RIGHT_PAREN",
    LEFT_BRACE = "LEFT_BRACE",
    RIGHT_BRACE = "RIGHT_BRACE",
    LEFT_BRACKET = "LEFT_BRACKET",
    RIGHT_BRACKET = "RIGHT_BRACKET",

    COMMA = "COMMA",
    DOT = "DOT",
    COLON = "COLON",
    SEMICOLON = "SEMICOLON",

    OPERATOR = "OPERATOR",

    IDENT = "IDENT",
    LINE_JUMP = "LINE_JUMP",

    BANG = "BANG",
    BANG_EQUAL = "BANG_EQUAL",
    EQUAL = "EQUAL",
    EQUAL_EQUAL = "EQUAL_EQUAL",
    GREATER = "GREATER",
    GREATER_EQUAL = "GREATER_EQUAL",
    LESS = "LESS",
    LESS_EQUAL = "LESS_EQUAL",

    IDENTIFIER = "IDENTIFIER",
    STRING = "STRING",
    NUMBER = "NUMBER",

    // KEYWORDS
    AND = "AND",
    CLASS = "CLASS",
    ELSE = "ELSE",
    FUN = "FUN",
    FOR = "FOR",
    IF = "IF",
    NONE = "NONE",
    OR = "OR",
    PRINT = "PRINT",
    RETURN = "RETURN",
    SUPER = "SUPER",
    SELF = "SELF",
    WHILE = "WHILE",

    INT = 'INT',

    // End of file
    EOF = "EOF"
}

const KEYWORDS: Record<string, TokenType> = {
    "and": TokenType.AND,
    "or": TokenType.OR,
    "if": TokenType.IF,
    "else": TokenType.ELSE,
    "for": TokenType.FOR,
    "while": TokenType.WHILE,
    
    "class": TokenType.CLASS,
    "fun": TokenType.FUN,
    "none": TokenType.NONE,
    "return": TokenType.RETURN,
    "super": TokenType.SUPER,
    "self": TokenType.SELF,

    'int': TokenType.INT
};

export interface Token {
    value: string
    type: TokenType
}

export const tokenize = (source: string): Token[] => {

    const tokens = new Array<Token>()
    const entries = source.split('')

    while (entries.length > 0) {
        let entry = entries[0]; entries.shift()

        if (entry == " " || entry == '\n') continue

        if (/[+\-*/%]/.exec(entry)) { tokens.push({ value: entry, type: TokenType.OPERATOR }); continue }

        if (/\(/.exec(entry)) { tokens.push({ value: entry, type: TokenType.LEFT_PAREN }); continue }

        if (/\)/.exec(entry)) { tokens.push({ value: entry, type: TokenType.RIGHT_PAREN }); continue }
        
        if (/\{/.exec(entry)) { tokens.push({ value: entry, type: TokenType.LEFT_BRACE }); continue }
        
        if (/\}/.exec(entry)) { tokens.push({ value: entry, type: TokenType.RIGHT_BRACE }); continue }
        
        if (/\[/.exec(entry)) { tokens.push({ value: entry, type: TokenType.LEFT_BRACKET }); continue }
        
        if (/\]/.exec(entry)) { tokens.push({ value: entry, type: TokenType.RIGHT_BRACKET }); continue }

        if (/,/.exec(entry)) { tokens.push({ value: entry, type: TokenType.COMMA }); continue }

        if (/[.]/.exec(entry)) { tokens.push({ value: entry, type: TokenType.DOT }); continue }

        if (/:/.exec(entry)) { tokens.push({ value: entry, type: TokenType.COLON }); continue }

        if (/;/.exec(entry)) { tokens.push({ value: entry, type: TokenType.SEMICOLON }); continue }

        if(/\t/.exec(entry)) { tokens.push({ value: entry, type: TokenType.IDENT }); continue }

        if (/!/.exec(entry)) {
            if (entries[0] == "=") {
                entries.shift()
                tokens.push({ value: entry + "=", type: TokenType.BANG_EQUAL })
            } else {
                tokens.push({ value: entry, type: TokenType.BANG })
            }
            continue
        }

        if (/=/.exec(entry)) {
            if (entries[0] == "=") {
                entries.shift()
                tokens.push({ value: entry + "=", type: TokenType.EQUAL_EQUAL })
            } else {
                tokens.push({ value: entry, type: TokenType.EQUAL })
            }
            continue
        }

        if (/>/.exec(entry)) {
            if (entries[0] == "=") {
                entries.shift()
                tokens.push({ value: entry + "=", type: TokenType.GREATER_EQUAL })
            } else {
                tokens.push({ value: entry, type: TokenType.GREATER })
            }
            continue
        }

        if (/</.exec(entry)) {
            if (entries[0] == "=") {
                entries.shift()
                tokens.push({ value: entry + "=", type: TokenType.LESS_EQUAL })
            } else {
                tokens.push({ value: entry, type: TokenType.LESS })
            }
            continue
        }

        if (/\d/.exec(entry)) {
            let number = entry

            while (entries.length > 0 && /\d/.exec(entries[0])) {
                number += entries[0]
                entries.shift()
            }

            tokens.push({ value: number, type: TokenType.NUMBER })
            continue
        }

        if (/[a-zA-Z]/.exec(entry)) {
            let identifier = entry

            while (entries.length > 0 && /[a-zA-Z]/.exec(entries[0])) {
                identifier += entries[0]
                entries.shift()
            }

            const reserved = KEYWORDS[identifier]

            if (reserved) {
                tokens.push({ value: identifier, type: reserved })
                continue
            } else {
                tokens.push({ value: identifier, type: TokenType.IDENTIFIER })
                continue
            }
        }

        throw new Error(`Token no esperado: ${entry}`)
    }

    tokens.push({ value: "EndOfFile", type: TokenType.EOF })

    return tokens
}
