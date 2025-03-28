import { LitElement, TemplateResult, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { ProgramBlock} from '../general/interfaces.ts'
import { consume} from '@lit/context';
import { programIndexExport, detailGeneralExport} from '../general/context';
import './block-element.ts';

const BREAKPOINT = html`<!-- BREAKPOINT -->`;

let stack_complex_name: ProgramBlock[] = [];
let stack_program_body: TemplateResult[]=[];

@customElement('vp-editor-element')
export class VPEditorElement extends LitElement {

  private _createBlockElement( endIndex: number=this.program.length): TemplateResult {
    let programVP: TemplateResult = html``;
    let program = stack_program_body.pop();
  
    while (program !== BREAKPOINT && stack_program_body.length >= 1) {
        programVP = html`${program}${programVP}`;
        program = stack_program_body.pop();
    }
    let item=stack_complex_name.pop();
    if(item){
      if(item.hide){
        return html`<block-element .block=${item} @change-detail=${() => this._changeDetail(endIndex, item)} .detail=${false}></block-element>`;
      }else{
          return html`<block-element .block=${item} @change-detail=${() => this._changeDetail(endIndex, item)}>${programVP}</block-element>`;
      }
    }else{
      return programVP
    }
  }

  private _changeDetail(index: number, item: ProgramBlock){//TODO clean code
    if(!this.detailGeneral){
      this.dispatchEvent(new CustomEvent('detail-index', {
        detail: { value: [index, this.program.indexOf(item)] },
        bubbles: true,
        composed: true
      }));
    }
  }

  @property()
  program: ProgramBlock[] = [];

  @consume({ context: programIndexExport, subscribe: true })
  @property({ attribute: false })
  programIndex: number=-1;

  @consume({ context: detailGeneralExport, subscribe: true})
  @property({attribute: false})
  detailGeneral: boolean=false;

  render() {
    if(this.program.length===0){
      return html`
      <div class="block">
        <div class="header">Insert first block of your program. </div>
        <div class="content" />
        </div>`
    }
    this.program.forEach((item)=>{
      if(this.program.indexOf(item)===this.programIndex && item.arguments.length===item.block.argTypes.length){
        stack_program_body.push(html`<div class="block"><div class="header">Insert next block of your program. </div></div>`);
      }
      if(item.block.id=="end"){
        stack_program_body.push(this._createBlockElement(this.program.indexOf(item)))//TODO clean code
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
    if(last.arguments.length===last.block.argTypes.length && this.programIndex===-1){
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
    margin: 4px ;
  }
  .header {
    padding: 6px 2px;
    color: white;
    font-weight: bold;
    border-radius: 4px 4px 0 0;
    background-color: gray;
  }

  .content {
    min-height: 80px;
    padding: 4px;
    border-radius: 0 0 4px 4px;
  }`
}

declare global {
  interface HTMLElementTagNameMap {
    'vp-editor-element': VPEditorElement
  }
}