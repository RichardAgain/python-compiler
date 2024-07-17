import Enviroment from "./environment";

export type ValueType = "null" | "undefined" | "boolean" | "number" | "bigint" | "string" | "symbol" | "object" | "native-function";

export interface RuntimeValue {
    type: ValueType
}    

export interface NullValue extends RuntimeValue {
    type: "null"
    value: null
}

export interface NumberValue extends RuntimeValue {
    type: "number"
    value: number
}

export interface BooleanValue extends RuntimeValue {
    type: "boolean"
    value: boolean
}

export interface ObjectValue extends RuntimeValue {
    type: "object"
    properties: Map<string, RuntimeValue>
}

export type FunctionCall = (args: RuntimeValue[], env: Enviroment) => RuntimeValue
export interface NativeFunctionValue extends RuntimeValue {
    type: "native-function"
    call: FunctionCall;
}

export function MK_NUMBER (n = 0) {
    return { type: "number", value: n } as NumberValue
}

export function MK_BOOLEAN (b = false) {
    return { type: "boolean", value: b } as BooleanValue
}

export function MK_NULL () {
    return { type: "null", value: null } as NullValue
}

export function MK_NATIVE_FN (call: FunctionCall) {
    return { type: "native-function", call: call } as NativeFunctionValue
}
