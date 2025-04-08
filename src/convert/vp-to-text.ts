import { ProgramBlock, Argument} from '../general/interfaces'


export function vpToText(program: ProgramBlock[]): string{
    let stack: string[] = [];
    let value: string = '';
    let deepCounter: number = 1;

    value='[\n'
    program.forEach((item)=>{
        let tabs: string=''
        if(item.block.id==="end"){
            value=_removeComma(value);
            value = value + stack.pop();
            deepCounter-=2
        }else{
            for(let i=0;i<deepCounter;i++){
                tabs=tabs+'  ';
            }
            value=value + tabs + '{\n'
            value=value + tabs + '  "id": "' + item.block.id + '",\n';
            let blockEnd=_addArgs(item.arguments, tabs + '  ', 'arguments');
            blockEnd=_removeComma(blockEnd);
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
      value=_removeComma(value);
      value = value + stack.pop();
    }
    value=_removeComma(value);
    value=value + ']'
    deepCounter=1
    return value;
}

function _addArgs(args: Argument[], tabs: string, title: string='value'): string{
    let blockEnd: string=''
    if(args.length!=0){
        blockEnd=tabs + '  "' + title + '": [\n';
        args.forEach((argument)=>{
            blockEnd=blockEnd + tabs + '  {\n';
            blockEnd=blockEnd + tabs + '    "type": "' + argument.type + '",\n'
            if(argument.args.length===0){
                blockEnd=blockEnd + tabs + '    "value": "' + argument.value + '"\n'
            }else{
                blockEnd=blockEnd + _addArgs(argument.args, tabs + '  ')
            }
            blockEnd=_removeComma(blockEnd);
            blockEnd=blockEnd + tabs + '  },\n';
        })
        blockEnd=_removeComma(blockEnd);
        blockEnd=blockEnd + tabs + '],\n';
    }
    return blockEnd
}

function _removeComma(text: string): string {
    if (text.length >= 2 && text[text.length - 2] === ',') {
        return text.slice(0, text.length - 2) + text[text.length - 1];
    }
    return text;
}
