export type TypeOption = 'number' | 'string' | 'bool' | 'expr'|'cond'|'note'|'variable'|
                        'AND'|'OR'|'NOT'|'=='|'!='|'>'|'<'|'>='|'<='|'+'|'-'|'*'|'/';

export type View = 'Graphical' | 'Text' | 'Both' ;

export type BlockType = 'branch' | 'cycle' | 'alert' | 'set_var' | 'dev'| 'end' | 'all'|'others';