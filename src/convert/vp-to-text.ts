import { ProgramBlock} from '../general/interfaces'
import { removeComma } from './remove-comma';
import { addArgsText } from './add-args-text';


export function vpToText(program: ProgramBlock[]): string{
    let stack: string[] = [];
    let value: string = '';
    let deepCounter: number = 1;

    value='[\n'
    program.forEach((item)=>{
        let tabs: string=''
        if(item.block.id==="end"){
            value=removeComma(value);
            value = value + stack.pop();
            deepCounter-=2
        }else{
            for(let i=0;i<deepCounter;i++){
                tabs=tabs+'  ';
            }
            value=value + tabs + '{\n'
            value=value + tabs + '  "id": "' + item.block.id + '",\n';
            let blockEnd=addArgsText(item.arguments, tabs + '  ', 'arguments');
            blockEnd=removeComma(blockEnd);
            blockEnd=blockEnd + tabs + '},\n';

            if(!item.block.simple){
                if(program.indexOf(item)===program.length-1 || program[program.indexOf(item)+1].block.id==='end'){
                    value=value + tabs + '  "block": [],\n'
                }else{
                    value=value + tabs + '  "block": [\n';
                    blockEnd=tabs + '  ],\n' + blockEnd
                }
                stack.push(blockEnd)
                deepCounter+=2
            }
            else{
                value=value + blockEnd
            }
        }
    })

    while(stack.length>=1){
      value=removeComma(value);
      value = value + stack.pop();
    }
    value=removeComma(value);
    value=value + ']'
    deepCounter=1
    return value;
}