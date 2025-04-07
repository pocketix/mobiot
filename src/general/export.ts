import { VarObject} from '../general/interfaces'
import { CondText } from './cond-text';


export function ExportText(block: string, varList: VarObject[]): string{
    let exportText: string = `{\n  "header": {\n    "userVariables": {\n`;
    varList.forEach((item)=>{
        exportText=exportText + `      "` + item.name + `": {\n        "type": "` + item.value.type + `",\n`;
        if(item.value.value===''){
            exportText=exportText + `        "value": "` + CondText(item.value.args[0]) + `"\n`;
        }else{
            exportText=exportText + `        "value": "` + item.value.value + `"\n`;
        }
        exportText=exportText + `      }`
        if(varList.indexOf(item)!==varList.length-1) exportText=exportText + `,`;
        exportText=exportText + `\n`
    })
    exportText = exportText + `    },\n    "userProcedures": {}\n  },\n  "block": ` + block + `\n}`;
    return exportText;
}