import { Argument } from "../general/interfaces";
import { removeComma } from "./remove-comma";

export function addArgsText(args: Argument[], tabs: string, title: string='value'): string{
    let blockEnd: string=''
    if(args.length!=0){
        blockEnd=tabs + '  "' + title + '": [\n';
        args.forEach((argument)=>{
            blockEnd=blockEnd + tabs + '  {\n';
            blockEnd=blockEnd + tabs + '    "type": "' + argument.type + '",\n'
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