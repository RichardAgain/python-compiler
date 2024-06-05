"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenize = exports.Tokentype = void 0;
var fs = require("fs");
var Tokentype;
(function (Tokentype) {
    Tokentype["Number"] = "numero";
    Tokentype["Identifier"] = "identificador";
    Tokentype["Operator"] = "operador binario";
    Tokentype["OpenParent"] = "abre grupo";
    Tokentype["CloseParent"] = "cierra grupo";
    Tokentype["EOF"] = "EOF";
})(Tokentype || (exports.Tokentype = Tokentype = {}));
var tokenize = function (source) {
    var tokens = new Array();
    var entries = source.split('');
    while (entries.length > 0) {
        var entry = entries[0];
        entries.shift();
        if (entry == " ")
            continue;
        if (/[a-z]/.exec(entry)) {
            tokens.push({ value: entry, type: Tokentype.Identifier });
            continue;
        }
        if (/[+\-*/]/.exec(entry)) {
            tokens.push({ value: entry, type: Tokentype.Operator });
            continue;
        }
        if (/\(/.exec(entry)) {
            tokens.push({ value: entry, type: Tokentype.OpenParent });
            continue;
        }
        if (/\)/.exec(entry)) {
            tokens.push({ value: entry, type: Tokentype.CloseParent });
            continue;
        }
        if (/\d/.exec(entry)) {
            var number = entry;
            while (entries.length > 0 && /\d/.exec(entries[0])) {
                number += entries[0];
                entries.shift();
            }
            tokens.push({ value: number, type: Tokentype.Number });
            continue;
        }
        console.log('caracter desconocido: ' + entry);
    }
    tokens.push({ value: "EndOfFile", type: Tokentype.EOF });
    return tokens;
};
exports.tokenize = tokenize;
var file = fs.readFileSync('./texto.txt', 'utf-8');
console.log((0, exports.tokenize)(file));
