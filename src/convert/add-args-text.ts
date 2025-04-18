import { Argument } from "../general/interfaces";
import { TypeOption } from "../general/types";
import { removeComma } from "./remove-comma";

export function addArgsText(args: Argument[], tabs: string, title: string='value'): string{
    let blockEnd: string=''
    if(args.length!=0){
        blockEnd=tabs + '  "' + title + '": [\n';
        args.forEach((argument)=>{
            blockEnd=blockEnd + tabs + '  {\n';
            blockEnd=blockEnd + tabs + '    "type": "' + convertType(argument.type) + '",\n'
            if(argument.args.length===0){
                blockEnd=blockEnd + tabs + '    "value": "' + argument.value + '"\n'
            }else{
                blockEnd=blockEnd + addArgsText(argument.args, tabs + '  ')
            }
            blockEnd=removeComma(blockEnd);
            blockEnd=blockEnd + tabs + '  },\n';
        })
        blockEnd=removeComma(blockEnd);
        blockEnd=blockEnd + tabs + '],\n';
    }
    return blockEnd
}

function convertType(typeText: TypeOption): string{
    switch(typeText){
        case('text'): return 'string';
        case('='): return '===';
        case('≠'): return '!===';
        case('AND'): return '&&';
        case('OR'): return '||';
        case('NOT'): return '!';
        default: return typeText;
    }
}