
export interface Block {
    name: string;
    simple: boolean;
    id: string;
}

export interface OptionBlock {
    block: Block;
    arguments: boolean;
}

export interface ProgramBlock {
    block: Block;
    arguments: VarObject[]
}

export type TypeOption = 'num' | 'str' | 'bool' | 'expr'|'boolean_expression'|'note'|'variable'|'&&';

export interface VarObject {
    type: TypeOption | null;
    name: string;
    value: string;
}

export interface Argument {
    type: TypeOption;
    value: string;
    args: Argument[]
}

export interface ConditionObject {
    type: TypeOption | null;
    name: string;
    value: Argument[];
}