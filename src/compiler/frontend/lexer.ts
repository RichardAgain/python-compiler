
export enum TokenType {
    LEFT_PAREN = "LEFT_PAREN",
    RIGHT_PAREN = "RIGHT_PAREN",

    LEFT_BRACE = "LEFT_BRACE",
    RIGHT_BRACE = "RIGHT_BRACE",
    COMMA = "COMMA",
    DOT = "DOT",

    // MINUS = "MINUS",
    // PLUS = "PLUS",
    // SLASH = "SLASH",
    // STAR = "STAR",

    OPERATOR = "OPERATOR",

    SEMICOLON = "SEMICOLON",

    // One or two character tokens
    BANG = "BANG",
    BANG_EQUAL = "BANG_EQUAL",
    EQUAL = "EQUAL",
    EQUAL_EQUAL = "EQUAL_EQUAL",
    GREATER = "GREATER",
    GREATER_EQUAL = "GREATER_EQUAL",
    LESS = "LESS",
    LESS_EQUAL = "LESS_EQUAL",

    // Literals
    IDENTIFIER = "IDENTIFIER",
    STRING = "STRING",
    NUMBER = "NUMBER",

    // Keywords
    AND = "AND",
    CLASS = "CLASS",
    ELSE = "ELSE",
    FALSE = "FALSE",
    FUN = "FUN",
    FOR = "FOR",
    IF = "IF",
    NONE = "NONE",
    OR = "OR",
    PRINT = "PRINT",
    RETURN = "RETURN",
    SUPER = "SUPER",
    SELF = "SELF",
    TRUE = "TRUE",
    WHILE = "WHILE",

    // End of file
    EOF = "EOF"
}

export interface Token {
    value: string
    type: TokenType
}

export const tokenize = (source: string): Token[] => {

    const tokens = new Array<Token>()
    const entries = source.split('')

    while (entries.length > 0) {
        let entry = entries[0]; entries.shift()

        if (entry == " ") continue

        if (/[a-z]/.exec(entry)) { tokens.push({ value: entry, type: TokenType.IDENTIFIER }); continue }

        if (/[+\-*/%]/.exec(entry)) { tokens.push({ value: entry, type: TokenType.OPERATOR }); continue }

        if (/\(/.exec(entry)) { tokens.push({ value: entry, type: TokenType.LEFT_PAREN }); continue }

        if (/\)/.exec(entry)) { tokens.push({ value: entry, type: TokenType.RIGHT_PAREN }); continue }

        if (/\d/.exec(entry)) {
            let number = entry

            while (entries.length > 0 && /\d/.exec(entries[0])) {
                number += entries[0]
                entries.shift()
            }

            tokens.push({ value: number, type: TokenType.NUMBER })
            continue;
        }

        console.log('caracter desconocido: ' + entry)
    }

    tokens.push({ value: "EndOfFile", type: TokenType.EOF })

    return tokens
}
