
import * as fs from 'fs';

export enum Tokentype {
    Number = "numero",
    Identifier = "identificador",
    Operator = "operador binario",
    OpenParent = "abre grupo",
    CloseParent = "cierra grupo",
    EOF = "EOF"
}

export interface Token {
    value: string
    type: Tokentype
}

export const tokenize = (source: string): Token[] => {

    const tokens = new Array<Token>()
    const entries = source.split('')

    while (entries.length > 0) {
        let entry = entries[0]; entries.shift()

        if (entry == " ") continue

        if (/[a-z]/.exec(entry)) { tokens.push({ value: entry, type: Tokentype.Identifier }); continue }

        if (/[+\-*/]/.exec(entry)) { tokens.push({ value: entry, type: Tokentype.Operator }); continue }

        if (/\(/.exec(entry)) { tokens.push({ value: entry, type: Tokentype.OpenParent }); continue }

        if (/\)/.exec(entry)) { tokens.push({ value: entry, type: Tokentype.CloseParent }); continue }

        if (/\d/.exec(entry)) { 
            let number = entry

            while (entries.length > 0 && /\d/.exec(entries[0])) {
                number += entries[0]
                entries.shift()
            }

            tokens.push({ value: number, type: Tokentype.Number })
            continue;
        }

        console.log('caracter desconocido: ' + entry)
    }

    tokens.push({ value: "EndOfFile", type: Tokentype.EOF })

    return tokens
}

const file = fs.readFileSync('./texto.txt', 'utf-8');

console.log(tokenize(file))
