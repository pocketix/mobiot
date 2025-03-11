import { createContext } from '@lit/context';

export interface Block {
    name: string;
    simple: boolean;
    id: string;
    type: BlockType;
    argTypes: TypeOption[];
}

export interface ProgramBlock {
    block: Block;
    arguments: Argument[];
    hide: boolean
}

export type TypeOption = 'num' | 'str' | 'bool' | 'expr'|'boolean_expression'|'note'|'variable'|
                        'AND'|'OR'|'NOT'|'=='|'!='|'>'|'<'|'>='|'<='|'+'|'-'|'*'|'/';

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

export const varListExport = createContext<VarObject[]>('var-list');//TODO own file

export const condListExport = createContext<VarObject[]>('cond-list');//TODO folder tree