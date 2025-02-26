import { LitElement, TemplateResult, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import './block-element.ts';

const BREAKPOINT = html`<!-- BREAKPOINT -->`;

let stack_complex_name: ProgramBlock[] = [];
let stack_program_body: TemplateResult[]=[]

interface ProgramBlock {
  name: string;
  simple: boolean;
  condition: string;
}

function createBlockElement(): TemplateResult {
  let programVP: TemplateResult = html``;
  let program = stack_program_body.pop();

  while (program !== BREAKPOINT && stack_program_body.length >= 1) {
      programVP = html`${program}${programVP}`;
      program = stack_program_body.pop();
  }
  let item=stack_complex_name.pop();//TODO repair undefined in stack
  return html`<block-element title=${item?.name} condition=${item?.condition}>${programVP}</block-element>`;
}

@customElement('vp-editor-element')
export class VPEditorElement extends LitElement {

  @property()
  program: ProgramBlock[] = [];

  render() {
    this.program.forEach((item)=>{
      if(item.name=="End of block"){
        stack_program_body.push(createBlockElement())
      }
      else if(item.simple==true){
        stack_program_body.push(html`<block-element title=${item.name}></block-element>`);
      }
      else{
        stack_complex_name.push(item);
        stack_program_body.push(BREAKPOINT);
      }
    });
    while(stack_complex_name.length>=1){
      stack_program_body.push(createBlockElement())
    };
    return html`${stack_program_body.pop()}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'vp-editor-element': VPEditorElement
  }
}