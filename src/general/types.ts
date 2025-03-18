export type TypeOption = 'num' | 'str' | 'bool' | 'expr'|'boolean_expression'|'note'|'variable'|
                        'AND'|'OR'|'NOT'|'=='|'!='|'>'|'<'|'>='|'<='|'+'|'-'|'*'|'/';

export type View = 'Graphical' | 'Text' | 'Both' ;

export type BlockType = 'branch' | 'cycle' | 'alert' | 'set_var' | 'dev'| 'end' | 'all'|'others';