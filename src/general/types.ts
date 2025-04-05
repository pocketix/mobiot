export type TypeOption = 'num' | 'str' | 'bool' | 'expr'|'cond'|'note'|'variable'|
                        'AND'|'OR'|'NOT'|'=='|'!='|'>'|'<'|'>='|'<='|'+'|'-'|'*'|'/';

export type View = 'Graphical' | 'Text' | 'Both' ;

export type BlockType = 'branch' | 'cycle' | 'alert' | 'set_var' | 'dev'| 'end' | 'all'|'others';