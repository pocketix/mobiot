import { LitElement, css, html, TemplateResult} from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { VarObject, ProgramBlock } from './general/interfaces.ts'
import { View } from './general/types.ts';
import { varListExport, condListExport } from './general/context.ts';
import { provide } from '@lit/context';
import './editor/vp-editor-element.ts';
import './editor/text-editor-element.ts';
import './variable/var-list-element.ts';
import './options-element.ts';
import './condition/cond-edit-element.ts'
import './menu-element.ts'


@customElement('my-element')
export class MyElement extends LitElement {
  
  @property()
  docsHint = 'Click on the Vite and Lit logos to learn more'

    @property()
    programText: string=''

    @state()
    private view: View=window.matchMedia('(max-width: 768px)').matches ? 'Graphical' : 'Both';

    @provide({ context: condListExport })
    @property({attribute: false})
  conditions: VarObject[] = [
    {name: 'cond_1', value: {type: 'boolean_expression', value: '', args: 
      [{type: '==', value:'', args: [{type: '+', value: '', args: [{type: 'variable', value: 'x', args: []}, {type: 'num', value: '5', args: []}]}
      ,{type: 'num', value: '8', args: []}]}]}},//x+5==8
    {name: 'cond_2', value: {type: 'boolean_expression', value: '', args: 
      [{type: '!=', value:'', args: [{type: '*', value: '', args: [{type: 'variable', value: 'a', args: []}, {type: 'variable', value: 'b', args: []}]}
      ,{type: 'num', value: '8', args: []}]}]}},//a*b!=8
    {name: 'cond_3', value: {type: 'boolean_expression', value: '', args: 
      [{type: 'AND', value: '', args: [{type: 'variable', value: 'x', args: []}, {type: 'variable', value: 'y', args: []}]}]}},//x AND y
  ];

  @property()
  program: ProgramBlock[]=[
    {block: {name: "If", simple: false, id: "if", type: 'branch', argTypes: ['boolean_expression']}, 
      arguments: [{type: 'boolean_expression', value: '', args: 
        [{type: '==', value: '', args: [{type: 'variable', value: 'x', args: []}, {type: 'num', value: '5', args: []}]}]
      }], hide: false},
    {block: {name: "Send notification", simple: true, id: 'alert', type: 'alert', argTypes: ['str']}, 
      arguments: [{type: 'variable', value: 'name', args: []}], hide: false},
    {block: {name: "End of block", simple: true, id: "end", type: 'end', argTypes: []}, arguments: [], hide: false},
    {block: {name: "Else", simple: false, id: 'else', type: 'branch', argTypes: []}, arguments: [], hide: false}
  ];

  @provide({ context: varListExport })
  @property({attribute: false})
    varList: VarObject[] = [
            { name: 'name', value: {type: 'str',value: 'John', args: []}},
            { name: 'age', value: {type: 'num',value: '40', args: []}},
            { name: 'isAdmin', value: {type: 'bool',value: 'true', args: []}},
            { name: 'fee', value: {type: 'expr',value: 'a + b == 6', args: []}}
            ];

  render() {
    let editors: TemplateResult=html``;
    if(this.view==='Both'){
      editors=html`
          <vp-editor-element class="editor" 
            .program=${this.program} 
            @change-block=${(e: CustomEvent) => this._changeBlock(e.detail.value)}
            @delete-block=${(e: CustomEvent) => this._deleteBlock(e.detail.value)}></vp-editor-element>
          <text-editor-element class="editor" 
            .program=${this.program}></text-editor-element>`
    }
    else if(this.view==='Graphical'){
      editors=html`
        <vp-editor-element class="editor" 
          .program=${this.program} 
          @change-block=${(e: CustomEvent) => this._changeBlock(e.detail.value)}
          @delete-block=${(e: CustomEvent) => this._deleteBlock(e.detail.value)}></vp-editor-element>`
    }else{
      editors=html`
        <text-editor-element class="editor" .program=${this.program}></text-editor-element>`
    }
    return html`
      <div class="container">
        <menu-element class="menu"
          .programText=${this.programText} 
          @program-saved=${(e: CustomEvent) => this._saveText(e.detail.value)}
          .varList=${this.varList}
          @list-saved=${(e: CustomEvent) => this._varList(e.detail.value)}
          .view=${this.view}
          @view-saved=${(e: CustomEvent) => this._updateView(e.detail.value)}
          @cond-saved=${(e: CustomEvent) => this._addCond(e.detail.value)}></menu-element>
        <div class="editor-container">
          ${editors}
        </div>
        <options-element class="options"
          .conditions=${this.conditions} .variables=${this.varList} .program=${this.program}
          @block-saved=${(e: CustomEvent) => this._updateProgram(e.detail.value)}></options-element>
      </div>
    `
  }

  private _varList(newVar: VarObject[]) {
    this.varList = [ ...newVar] ;
}

private _updateView(newView: View) {
  this.view = newView ;
}

private _updateProgram(updatedProgram: ProgramBlock[]) {
  this.program = [ ...updatedProgram ];
}

private _saveText(newProgram: string) {
  this.programText=newProgram ;
}

private _addCond(newCond: VarObject){
  this.conditions=[...this.conditions, newCond]
}


private _changeBlock(block: ProgramBlock){
  this.program = this.program.map(b => 
    b === block ? { ...block } : b
  );
}

private _deleteBlock(block: ProgramBlock){
  const index = this.program.indexOf(block);
  let deepCounter=1;

  if (index !== -1) {
    if(block.block.simple){
      this.program=this.program.filter(item=>item!=block)
    }else{
      let endIndex = index + 1;
      while (endIndex < this.program.length && deepCounter>0) {
        if(!this.program[endIndex].block.simple)deepCounter++;
        if(this.program[endIndex].block.id==='end')deepCounter--;
        endIndex++;
      }

      this.program = [...this.program.slice(0, index), ...this.program.slice(endIndex)];
    }
  }//TODO syntax control 4th phase
}

  static styles = css`
    :host {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0.5rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      background: white;
    }

    @media (max-width: 768px) {
      :host {
        width: 100%;
        margin: 0;
        padding: 0;
      }
    }

    .container {
      display: flex;
      flex-direction: column;
      height: 100vh;
    }

    .menu{
      flex: 0 0 auto;
      z-index: 105;
    }

    .editor{
      flex: 1;
      position: relative;
      z-index: 100;
    }

    .editor-container {
      flex: 1 1 auto;
      overflow-y: auto;
      display: flex; 
    }

    a {
      font-weight: 500;
      color: #646cff;
      text-decoration: inherit;
    }
    a:hover {
      color: #535bf2;
    }

    button {
      border-radius: 8px;
      border: 1px solid transparent;
      padding: 0.6em 1.2em;
      font-size: 1em;
      font-weight: 500;
      font-family: inherit;
      background-color: #1a1a1a;
      cursor: pointer;
      transition: border-color 0.25s;
    }
    button:hover {
      border-color: #646cff;
    }
    button:focus,
    button:focus-visible {
      outline: 4px auto -webkit-focus-ring-color;
    }

    .options {
      flex: 0 0 20vh;
      overflow-y: auto;
      width: 100%;
      border-top: 2px solid #ccc;
      z-index: 10;
      background: rgb(168, 168, 168);;
    }

 
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'my-element': MyElement
  }
}
