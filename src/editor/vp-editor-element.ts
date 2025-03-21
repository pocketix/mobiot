import { LitElement, TemplateResult, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { ProgramBlock} from '../general/interfaces.ts'
import './block-element.ts';

const BREAKPOINT = html`<!-- BREAKPOINT -->`;

let stack_complex_name: ProgramBlock[] = [];
let stack_program_body: TemplateResult[]=[];//TODO rewrite to one stack, not necessary

@customElement('vp-editor-element')
export class VPEditorElement extends LitElement {

  private _createBlockElement(detail: boolean=false): TemplateResult {
    let programVP: TemplateResult = html``;
    let program = stack_program_body.pop();
  
    while (program !== BREAKPOINT && stack_program_body.length >= 1) {
        programVP = html`${program}${programVP}`;
        program = stack_program_body.pop();
    }
    let item=stack_complex_name.pop();
    if(item){
      if(item.hide){
        return html`<block-element .block=${item} .detail=${false}></block-element>`;
      }else{
        if(detail){
          return html`<block-element .block=${item} .detail=${false}>${programVP}</block-element>`;
        }
        else{
          return html`<block-element .block=${item}>${programVP}</block-element>`;
        }
      }
    }else{
      return programVP
    }
  }

  @property()
  program: ProgramBlock[] = [];

  render() {
    if(this.program.length===0){
      return html`
      <div class="block">
        <div class="header">Insert first block of your program. </div>
        <div class="content" />
        </div>`
    }
    this.program.forEach((item)=>{
      if(item.block.id=="end"){
        stack_program_body.push(this._createBlockElement(true))
      }
      else if(item.block.simple==true){
        stack_program_body.push(html`<block-element .block=${item}></block-element>`);
      }
      else{
        stack_complex_name.push(item);
        stack_program_body.push(BREAKPOINT);
      }
    });
    let last:ProgramBlock=this.program[this.program.length-1];
    if(last.arguments.length===last.block.argTypes.length){
      stack_program_body.push(html`<div class="block"><div class="header">Insert next block of your program. </div></div>`);
    }
    while(stack_complex_name.length>=1){
      stack_program_body.push(this._createBlockElement())
    };
    let programBody: TemplateResult=html``
    while(stack_program_body.length>=1){
      programBody=html`${stack_program_body.pop()}${programBody}`
    }
    return programBody;
  }

static styles = css`
  .block {
    display: block;
    border: 2px solid #333;
    border-radius: 8px;
    background-color: #e0e0e0;
    margin: 8px;
  }
  .header {
    padding: 8px;
    color: white;
    font-weight: bold;
    border-radius: 4px 4px 0 0;
    background-color: gray;
  }

  .content {
    min-height: 80px;
    padding: 8px;
    border-radius: 0 0 4px 4px;
  }`
}

declare global {
  interface HTMLElementTagNameMap {
    'vp-editor-element': VPEditorElement
  }
}