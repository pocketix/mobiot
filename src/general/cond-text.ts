
import { Argument} from '../general/interfaces'


export function CondText(cond: Argument): string{
    if(cond.args.length>0){
        let result: string='(';
        cond.args.forEach((item)=>{
            if(result==='('){
                result=result + CondText(item);
            }else{
                result=result + cond.type + CondText(item) 
            }
        })
        return result + ')'
    }else{
        return cond.value;
    }
}