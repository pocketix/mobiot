import { VarObject, Argument} from '../general/interfaces'


export function UpdateVarList(header: any): VarObject[]{
    let varList: VarObject[] = [];
    if(header && typeof header.userVariables === 'object'){
        for (const [name, data] of Object.entries(header.userVariables)) {
            if (typeof data === 'object' && data !== null && 'type' in data && 'value' in data) {
                const arg = data as Argument;
                const variable: VarObject = {
                  name: name,
                  value: {
                    type: arg.type,
                    value: arg.value,
                    args: arg.args || []//TODO repair for expr. 
                  }
                }
                varList.push(variable);
              }
          }
    }

    return varList;
}