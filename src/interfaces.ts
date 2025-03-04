
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

export type TypeOption = 'num' | 'str' | 'bool' | 'expr'|'boolean_expression'|'note'|'variable'|'&&';

export type View = 'vp' | 'text' | 'both' ;

export interface VarObject {
    name: string;
    value: Argument[]//TODO check if file is necessary
}

export interface Argument {
    type: TypeOption;
    value: string;
    args: Argument[]
}