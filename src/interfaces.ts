
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
    arguments: Argument[]
}

export interface Argument {
    type: string;
    value: string;
}

export type TypeOption = 'num' | 'str' | 'bool' | 'expr';

export interface VarObject {
    type: TypeOption | null;
    name: string;
    value: string;
}