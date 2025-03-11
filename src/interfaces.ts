import { createContext } from '@lit/context';

export interface Block {
    name: string;
    simple: boolean;
    id: string;
    type: BlockType;
    argTypes: TypeOption[];
}

// export interface OptionBlock {
//     block: Block;
// }

export interface ProgramBlock {
    block: Block;
    arguments: Argument[];
    hide: boolean
}

export type TypeOption = 'num' | 'str' | 'bool' | 'expr'|'boolean_expression'|'note'|'variable'|'&&';

export type View = 'vp' | 'text' | 'both' ;

export type BlockType = 'branch' | 'cycle' | 'alert' | 'set_var' | 'dev'| 'end' | 'all';

export interface VarObject {
    name: string;
    value: Argument
}

export interface Argument {
    type: TypeOption;
    value: string;
    args: Argument[]
}

export const varListExport = createContext<VarObject[]>('root-data');