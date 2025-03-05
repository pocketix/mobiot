
export interface Block {
    name: string;
    simple: boolean;
    id: string;
}

export interface OptionBlock {
    block: Block;
    arguments: boolean;
    type: BlockType;
}

export interface ProgramBlock {
    block: Block;
    arguments: Argument[]
}

export type TypeOption = 'num' | 'str' | 'bool' | 'expr'|'boolean_expression'|'note'|'variable'|'&&';

export type View = 'vp' | 'text' | 'both' ;

export type BlockType = 'branch' | 'cycle' | 'alert' | 'set_var' | 'dev'| 'end' | 'all';

export interface VarObject {
    name: string;
    value: Argument[]//TODO check if field necessary
}

export interface Argument {
    type: TypeOption;
    value: string;
    args: Argument[]
}