import { ProgramBlock, Argument, Block} from '../general/interfaces';
import { blockTypes } from '../general/blocks';

const BLOCKS = blockTypes;

export function TextToVp(program: any): ProgramBlock[]{
    let programVP: ProgramBlock[] = [];

    if(Array.isArray(program)){
        program.forEach((item)=>{
            programVP = _blockConvertion(programVP, item)
        })
    }
    console.log(programVP);
    return programVP
}

function _blockConvertion(programVP: ProgramBlock[], block: any): ProgramBlock[]{
    let newBlock: ProgramBlock;
    if('id' in block){
        let selected: Block | undefined;
        if(selected=BLOCKS.find(item=>item.id===block.id)){
            newBlock={block: selected, hide: false, arguments: []};
            if('arguments' in block && Array.isArray(block.arguments)){
                block.arguments.forEach((item: any) => {
                    let newArg=_argumentConvertion(item);
                    if(newArg){
                        newBlock.arguments.push(newArg);
                    }
                })
            }

            programVP.push(newBlock);
            if('block' in block && Array.isArray(block.block)){
                block.block.forEach((item: any) => {
                    programVP=_blockConvertion(programVP, item);
                })
                programVP.push({ block: {name: "End of block", simple: true, id: "end", argTypes: [], type: 'end'}, arguments: [], hide: false })
            }
        }
    }
    return programVP;
}

function _argumentConvertion(arg: any): Argument|null{
    if('type' in arg){
        if('value' in arg){
            if(Array.isArray(arg.value)){
                let newArgs: Argument[]=[]
                arg.value.forEach((item: any) => {
                    let newArg=_argumentConvertion(item);
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