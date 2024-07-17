import { MK_BOOLEAN, MK_NATIVE_FN, MK_NULL, MK_NUMBER, NumberValue, RuntimeValue } from "./values"

export function createGlobalEnv () {
    const env = new Enviroment()

    env.declareVariable("x", MK_NUMBER(10))
    env.declareVariable("y", MK_NUMBER(20))

    env.declareVariable('true', MK_BOOLEAN(true), true)
    env.declareVariable('false', MK_BOOLEAN(false), true)
    env.declareVariable('null', MK_NULL(), true)

    //NATIVE METHODS
    env.declareVariable('print', MK_NATIVE_FN((args, scope) => {
        for (const arg of args) {
            env.output.push(arg)
        }

        return MK_NULL()
    }), true)

    return env
}

export default class Enviroment {
    private parent?: Enviroment
    public varibables: Map<string, RuntimeValue> = new Map()
    private reserved: Set<string>

    public output = new Array<RuntimeValue>()

    constructor (parentENV?: Enviroment) {
        const global = !!parentENV
        this.parent = parentENV
        this.varibables = new Map()
        this.reserved = new Set()
    }

    public declareVariable (varname: string, value: RuntimeValue, reserved: boolean = false): RuntimeValue {
        if (this.varibables.has(varname)) {
            this.assignVariable(varname, value)
        }

        this.varibables.set(varname, value)

        if (reserved) {
            this.reserved.add(varname)
        }

        return value
    }

    public assignVariable (varname: string, value: RuntimeValue): RuntimeValue {
        const env = this.resolve(varname)
        if (env.reserved.has(varname)) {
            throw new Error(`Cannot assign to reserved variable ${varname}`)
        }
        env.varibables.set(varname, value)

        return value
    }

    public lookupVariable (varname: string): RuntimeValue {
        const env = this.resolve(varname)
        return env.varibables.get(varname) as RuntimeValue
    }

    public resolve (varname: string): Enviroment {
        if (this.varibables.has(varname)) {
            return this
        }

        if (this.parent) {
            return this.parent.resolve(varname)
        }

        throw new Error(`Cannot resolve "${varname}"`)
    }
}