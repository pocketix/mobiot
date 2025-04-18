import { Argument } from "../general/interfaces";
import { TypeOption } from "../general/types";

export function argumentConvertionVP(arg: any): Argument|null{
    if('type' in arg){
        if('value' in arg){
            if(Array.isArray(arg.value)){
                let newArgs: Argument[]=[]
                arg.value.forEach((item: any) => {
                    let newArg = argumentConvertionVP(item);
                    if(newArg) newArgs.push(newArg);
                })
                return {type: convertType(arg.type), value: '', args: newArgs};
            }else{
                return {type: convertType(arg.type), value: arg.value, args: []};
            }
        }
    }
    return null;
  }

function convertType(typeText: any): TypeOption{
    switch(typeText){
        case('string'): return 'text';
        case('==='): return '=';
        case('!==='): return '≠';
        case('&&'): return 'AND';
        case('||'): return 'OR';
        case('!'): return 'NOT';
        default: return typeText;
    }
}