import { Argument } from "../general/interfaces";

export function argumentConvertionVP(arg: any): Argument|null{
    if('type' in arg){
        if('value' in arg){
            if(Array.isArray(arg.value)){
                let newArgs: Argument[]=[]
                arg.value.forEach((item: any) => {
                    let newArg = argumentConvertionVP(item);
                    if(newArg) newArgs.push(newArg);
                })
                return {type: arg.type, value: '', args: newArgs};
            }else{
                return {type: arg.type, value: arg.value, args: []};
            }
        }
    }
    return null;
  }