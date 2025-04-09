import { VarObject, Argument} from '../general/interfaces'
import { TypeOption } from '../general/types';
import { argumentConvertionVP } from './argument-convertion-vp';


export function UpdateVarList(header: any): VarObject[]{
  let varList: VarObject[] = [];
  if(header && typeof header.userVariables === 'object'){
    for (const [name, data] of Object.entries(header.userVariables)) {
      if (typeof data === 'object' && data !== null && 'type' in data && 'value' in data) {
        if(Array.isArray(data.value)){
          let argument=argumentConvertionVP(data.value[0]);
          if(argument){
            const variable: VarObject = {
              name: name,
              value: {
                type: data.type as TypeOption,
                value: '',
                args: [argument]
              }
            }
          varList.push(variable);
          }
        }else{
          const arg = data as Argument;
          const variable: VarObject = {
            name: name,
            value: {
              type: arg.type,
              value: arg.value,
              args: []
            }
          }
          varList.push(variable);
        }
      }
    }
  }
  return varList;
}