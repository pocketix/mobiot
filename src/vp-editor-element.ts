import { LitElement, TemplateResult, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { ProgramBlock} from './interfaces'
import './block-element.ts';

const BREAKPOINT = html`<!-- BREAKPOINT -->`;

let stack_complex_name: ProgramBlock[] = [];
let stack_program_body: TemplateResult[]=[];//TODO rewrite to one stack? 

@customElement('vp-editor-element')
export class VPEditorElement extends LitElement {

  private _createBlockElement(): TemplateResult {
    let programVP: TemplateResult = html``;
    let program = stack_program_body.pop();
  
    while (program !== BREAKPOINT && stack_program_body.length >= 1) {
        programVP = html`${program}${programVP}`;
        program = stack_program_body.pop();
    }
    let item=stack_complex_name.pop();//TODO repair undefined in stack
    if(item?.hide){
      return html`<block-element .block=${item}></block-element>`;//TODO repair for all args
    }else{
      return html`<block-element .block=${item}>${programVP}</block-element>`;//TODO repair for all args
    }
  }

  @property()
  program: ProgramBlock[] = [];

  render() {
    this.program.forEach((item)=>{
      if(item.block.id=="end"){
        stack_program_body.push(this._createBlockElement())
      }
      else if(item.block.simple==true){
        stack_program_body.push(html`<block-element .block=${item}></block-element>`);
      }
      else{
        stack_complex_name.push(item);
        stack_program_body.push(BREAKPOINT);
      }
    });
    while(stack_complex_name.length>=1){
      stack_program_body.push(this._createBlockElement())
    };
    let programBody: TemplateResult=html``
    while(stack_program_body.length>=1){//TODO check
      programBody=html`${stack_program_body.pop()}${programBody}`
    }
    return programBody;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'vp-editor-element': VPEditorElement
  }
}